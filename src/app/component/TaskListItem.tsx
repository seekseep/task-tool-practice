"use client"

import { FC } from "react"
import { useMutation } from "@tanstack/react-query"
import { View, Flex, useTheme, Divider, Text, Button, Loader } from "@aws-amplify/ui-react"

import { deleteTask } from "../service/api/task"
import { Task } from "../service/api/task/types"
import { TaskHistoryAction } from "./type"

const TaskListItem: FC<{
  task: Task
  onChange?: (action: TaskHistoryAction) => void
}> = ({ task, onChange }) => {
  const theme = useTheme()

  const deleteMutation = useMutation(deleteTask, {
    onSuccess () { onChange && onChange({ type: 'DELETE', payload: { id: task.id } }) }
  })

  return (
    <View>
      <View
        paddingBlock={theme.tokens.space.small}
        paddingInline={theme.tokens.space.xs}>
        <Flex direction="row" gap={theme.tokens.space.xs}>
          <Text paddingBlock={theme.tokens.space.xs} grow={1}>{task.name}</Text>
          {deleteMutation.isLoading ? (
            <Button disabled variation="warning">
              <Loader />
            </Button>
          ) : (
            <Button onClick={() => deleteMutation.mutate({ id: task.id }) } variation="warning">削除</Button>
          )}
        </Flex>
      </View>
      <Divider />
    </View>
  )
}

export default TaskListItem
