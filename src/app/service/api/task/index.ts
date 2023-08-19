import { API, GraphQLResult, graphqlOperation } from "@aws-amplify/api";

import {
  Task,
  CreateTaskInput,
  CreateTaskMutation,
  CreateTaskMutationVariables,
  GetTaskQuery,
  GetTaskQueryVariables,
  ListTasksQueryVariables,
  ListTasksQuery,
  UpdateTaskInput,
  UpdateTaskMutation,
  UpdateTaskMutationVariables,
  DeleteTaskInput,
  DeleteTaskMutation,
  DeleteTaskMutationVariables,
} from "./types";
import * as mutations from './mutations'
import * as queries from './queries'

export async function createTask (input: CreateTaskInput) {
  const result = (await API.graphql(
    graphqlOperation(mutations.createTask, {
      input
    } as CreateTaskMutationVariables)
  )) as GraphQLResult<CreateTaskMutation>
  if (result.errors) throw result.errors
  if (!result.data?.createTask) throw Error("Invalid Response")
  return result.data?.createTask
}

export async function listTasks () {
  const tasks: Task[] = []

  let nextToken: string | null | undefined = null
  do {
    const result = (await API.graphql(
      graphqlOperation(queries.listTasks, {
        filter: {
          deletedAt: {
            attributeExists: false
          }
        },
        nextToken
      } as ListTasksQueryVariables)
    )) as GraphQLResult<ListTasksQuery>
    if (result.errors) throw result.errors
    for (const item of result.data?.listTasks?.items ?? []) {
      if (!item) continue
      tasks.push(item)
    }
    nextToken = result.data?.listTasks?.nextToken
  } while (typeof nextToken === "string")

  return tasks
}

export async function getTask(id: string) {
  const result = (await API.graphql(
    graphqlOperation(queries.getTask, {
      id
    } as GetTaskQueryVariables)
  )) as GraphQLResult<GetTaskQuery>
  if (result.errors) throw result.errors
  if (!result.data?.getTask) throw Error()

  return result.data.getTask
}

export async function updateTask (input: UpdateTaskInput) {

  const result = (await API.graphql(
    graphqlOperation(mutations.updateTask, {
      input
    } as UpdateTaskMutationVariables)
  )) as GraphQLResult<UpdateTaskMutation>
  if (result.errors) throw result.errors
  if (!result.data?.updateTask) throw Error("Invalid Response")
  return result.data?.updateTask
}

export async function restoreTask (input: DeleteTaskInput) {
  const result = (await API.graphql(
    graphqlOperation(mutations.updateTask, {
      input: {
        id: input.id,
        deletedAt: null
      }
    } as UpdateTaskMutationVariables)
  )) as GraphQLResult<UpdateTaskMutation>
  if (result.errors) throw result.errors
  if (!result.data?.updateTask) throw Error("Invalid Response")
  return result.data?.updateTask
}

export async function deleteTask (input: DeleteTaskInput) {
  const result = (await API.graphql(
    graphqlOperation(mutations.updateTask, {
      input: {
        id: input.id,
        deletedAt: new Date().toISOString()
      }
    } as UpdateTaskMutationVariables)
  )) as GraphQLResult<UpdateTaskMutation>
  if (result.errors) throw result.errors
  if (!result.data?.updateTask) throw Error("Invalid Response")
  return result.data?.updateTask
}

export async function permanentlyDeleteTask (input: DeleteTaskInput) {
  const result = (await API.graphql(
    graphqlOperation(mutations.deleteTask, {
      input
    } as DeleteTaskMutationVariables)
  )) as GraphQLResult<DeleteTaskMutation>
  if (result.errors) throw result.errors
  if (!result.data?.deleteTask) throw Error("Invalid Response")
  return result.data?.deleteTask
}
