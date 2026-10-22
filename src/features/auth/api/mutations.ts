import { useMutation, useQueryClient } from "@tanstack/react-query"

import { viewerKeys } from "@/entities/viewer"
import { authApi } from "@/shared/api"

export function useLogin() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: authApi.login,
    meta: { silentError: true },
    onSuccess: (user) => {
      client.clear()
      client.setQueryData(viewerKeys.me, user)
    },
  })
}

export function useRegister() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: authApi.register,
    meta: { silentError: true },
    onSuccess: (user) => {
      client.clear()
      client.setQueryData(viewerKeys.me, user)
    },
  })
}

export function useLogout() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => client.clear(),
  })
}
