export type TaskHistoryAction = {
  type: "DELETE"
  payload: { id: string }
} | {
  type: "CREATE"
  payload: {
    id: string
    name: string
    description?: string
  }
}
