import { useMutation } from "@tanstack/react-query"

import { uploadsApi, type Upload } from "@/shared/api"

/** Uploads files one by one (presigned PUT straight to storage), returning the ready uploads. */
export function useUploadFiles(wid: string) {
  return useMutation({
    mutationFn: async (files: File[]): Promise<Upload[]> => {
      const uploads: Upload[] = []
      for (const file of files) uploads.push(await uploadsApi.uploadFile(wid, file))
      return uploads
    },
  })
}
