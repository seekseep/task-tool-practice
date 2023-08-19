"use client"

import { useState } from "react"
import { View, TextField, Button, Flex, Alert, useTheme } from "@aws-amplify/ui-react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useHotkeys } from "react-hotkeys-hook"
import { useForm } from "react-hook-form"
import { MdSkipNext, MdSkipPrevious  } from 'react-icons/md'


import { createTask, deleteTask, listTasks, restoreTask, updateTask } from "../service/api/task"
import TaskListItem from "./TaskListItem"
import TaskListItemPlaceholder from "./TaskListItemPlaceholder"
import { TaskHistoryAction } from "./type"

const MAX_ACTION_COUNT = 100

const TaskManager = () => {
  const theme = useTheme()

  const [taskHistory, setTaskHistory] = useState<{
    status: 'READY' | 'PROCESSING',
    current: number
    actions: TaskHistoryAction[]
  }>({
    status: 'READY',
    current: -1,
    actions: []
  })

  function pushTaskHistoryAction (action: TaskHistoryAction) {
    setTaskHistory(({ actions, current, status }) => {
      const nextActions = [...actions]
      nextActions.splice(current + 1)
      nextActions.push(action)
      while (nextActions.length > MAX_ACTION_COUNT) nextActions.shift()
      return {
        status: status,
        current: nextActions.length - 1,
        actions: nextActions
      }
    })
  }

  const forwardMutation = useMutation(async () => {
    if (taskHistory.status !== "READY") throw Error("NotReady")
    const nextAction = taskHistory.actions[taskHistory.current + 1]
    if (!nextAction) throw Error("NoNextAction")
    switch(nextAction.type) {
      case 'DELETE': {
        const {id} = nextAction.payload
        return deleteTask({ id })
      }
      case 'CREATE': {
        const { id } = nextAction.payload
        return restoreTask({ id })
      }
    }
  }, {
    onSuccess () {
      setTaskHistory(({ actions, current }) => ({
        status: 'READY',
        actions: actions,
        current: current + 1
      }))
      listQuery.refetch()
    }
  })

  const backwardMutation = useMutation(async () => {
    if (taskHistory.status !== "READY") throw Error("NotReady")

    const nextAction = taskHistory.actions[taskHistory.current]
    if (!nextAction) throw Error("NoNextAction")

    switch(nextAction.type) {
      case 'DELETE': {
        const {id} = nextAction.payload
        return restoreTask({ id })
      }
      case 'CREATE': {
        const { id } = nextAction.payload
        return deleteTask({ id })
      }
    }
  }, {
    onSuccess () {
      setTaskHistory(({ actions, current }) => ({
        status: 'READY',
        actions: actions,
        current: current - 1
      }))
      listQuery.refetch()
    }
  })

  const listQuery = useQuery(['tasks'], listTasks)
  const createForm = useForm<{ name: string }>({})

  const createMutation = useMutation(createTask)

  const previousAction = taskHistory.actions[taskHistory.current]
  const nextAction = taskHistory.actions[taskHistory.current + 1]

  const ignoreEventWhen = (event: KeyboardEvent) => {
    return (event.target as HTMLElement)?.tagName === "INPUT"
  }

  useHotkeys('ctrl+z, mod+z', () => {
    if (typeof previousAction === "undefined") return
    backwardMutation.mutate()
  }, { ignoreEventWhen })
  useHotkeys('ctrl+shift+z, mod+shift+z', () => {
    if (typeof nextAction === "undefined") return
    forwardMutation.mutate()
  }, { ignoreEventWhen })

  const handleSubmitToCreate = createForm.handleSubmit(values => {
    createMutation.mutate({ name: values.name }, {
      onSuccess (task) {
        createForm.reset()
        pushTaskHistoryAction({
          type: "CREATE",
          payload: {
            id: task.id,
            name: values.name
          }
        })
        listQuery.refetch()
      }
    })
  })

  return (
    <View
      maxWidth={theme.breakpoints.values.large}
      padding={theme.tokens.space}>
      <Flex
        alignItems="start"
        justifyContent="space-between" gap={theme.tokens.space.medium} wrap="wrap">
        <Flex alignItems="start" as="form" onSubmit={handleSubmitToCreate} wrap="wrap">
          <TextField label="作業名" required labelHidden {...createForm.register("name")} />
          {createMutation.isLoading ? (
            <Button variation="primary" disabled>作成中</Button>
          ) : (
            <Button variation="primary" type="submit">作成する</Button>
          )}
        </Flex>
        <Flex alignItems="start">
          <Button
            onClick={() => backwardMutation.mutate()}
            disabled={typeof previousAction === 'undefined'}>
            <MdSkipPrevious />
          </Button>
          <Button
            onClick={() => forwardMutation.mutate()}
            disabled={typeof nextAction === 'undefined'}>
            <MdSkipNext />
          </Button>
        </Flex>
      </Flex>
      {createMutation.isSuccess && <Alert marginBlock={theme.tokens.space.xs} isDismissible variation="success">作成しました</Alert>}
      {createMutation.isError && <Alert marginBlock={theme.tokens.space.xs} isDismissible variation="error">作成できませんでした</Alert>}
      <View paddingBlock={theme.tokens.space.medium}>
        {listQuery.isLoading && (
          <>
            <TaskListItemPlaceholder />
            <TaskListItemPlaceholder />
            <TaskListItemPlaceholder />
            <TaskListItemPlaceholder />
            <TaskListItemPlaceholder />
          </>
        )}
        {listQuery.isSuccess && (
          <>
            {listQuery.data.length === 0 && (
              <Alert>作業が一つもありません</Alert>
            )}
            {listQuery.data.map(task => (
              <TaskListItem
                key={task.id} task={task}
                onChange={(action) => {
                  pushTaskHistoryAction(action)
                  listQuery.refetch()
                }
              } />
            ))}
          </>
        )}
      </View>
    </View>
  )
}

export default TaskManager
