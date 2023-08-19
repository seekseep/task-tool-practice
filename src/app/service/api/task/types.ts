import { ModelTaskFilterInput } from '@/API'

export type Task = {
  id: string
  name: string
  description?: string | null
  createdAt: string
  updatedAt: string
  deletedAt?: string
  owner?: string | null
};

export type CreateTaskInput = {
  name: string
  description?: string | null
};

export type UpdateTaskInput = {
  id: string
  name?: string | null
  description?: string | null
};

export type DeleteTaskInput = {
  id: string
};

export type CreateTaskMutationVariables = {
  input: CreateTaskInput
};

export type CreateTaskMutation = {
  createTask?: Task | null
};

export type UpdateTaskMutationVariables = {
  input: UpdateTaskInput
};

export type UpdateTaskMutation = {
  updateTask?: Task | null
};

export type DeleteTaskMutationVariables = {
  input: DeleteTaskInput
};

export type DeleteTaskMutation = {
  deleteTask?: Task | null
};

export type GetTaskQueryVariables = {
  id: string
};

export type GetTaskQuery = {
  getTask?: Task | null
};

export type ListTasksQueryVariables = {
  filter?: ModelTaskFilterInput | null
  nextToken?: string | null
};

export type ListTasksQuery = {
  listTasks?: {
    items: Task[]
    nextToken?: string | null
  } | null
};
