import { useMutation, useQueryClient } from "@tanstack/react-query"

import { brandProfileKeys } from "@/entities/brand-profile"
import { brandProfileApi, type BrandProfileInput } from "@/shared/api"

export function useSaveBrandProfile(wid: string) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (input: BrandProfileInput) => brandProfileApi.put(wid, input),
    onSuccess: (profile) => client.setQueryData(brandProfileKeys.detail(wid), profile),
  })
}
