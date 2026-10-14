import { useMutation, useQueryClient } from "@tanstack/react-query"

import { workspaceKeys } from "@/entities/workspace"
import { workspacesApi, type CreateWorkspaceInput, type UpdateWorkspaceInput } from "@/shared/api"

export function useCreateWorkspace() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateWorkspaceInput) => workspacesApi.create(input),
    onSuccess: (workspace) => {
      client.setQueryData(workspaceKeys.detail(workspace.id), workspace)
      return client.invalidateQueries({ queryKey: workspaceKeys.lists() })
    },
  })
}

export function useUpdateWorkspace() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ wid, input }: { wid: string; input: UpdateWorkspaceInput }) => workspacesApi.update(wid, input),
    onSuccess: (workspace) => {
      client.setQueryData(workspaceKeys.detail(workspace.id), workspace)
      return client.invalidateQueries({ queryKey: workspaceKeys.lists() })
    },
  })
}
