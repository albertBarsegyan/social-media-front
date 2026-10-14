import ky from "ky"

import { api } from "./client"
import { toApiError } from "./errors"

export interface Upload {
  id: string
  fileName: string
  contentType: string
  sizeBytes: number
  kind: "image" | "video" | "document"
  status: "pending" | "ready"
  /** Presigned GET URL (1 h) once ready. */
  url: string | null
  createdAt: string
}

export interface CreatedUpload {
  upload: Upload
  uploadUrl: string
  uploadMethod: "PUT"
  uploadHeaders: Record<string, string>
  expiresAt: string
}

const base = (wid: string) => `workspaces/${wid}/uploads`

export const uploadsApi = {
  create: (wid: string, input: { fileName: string; contentType: string; sizeBytes: number }) =>
    api.post(base(wid), { json: input }).json<CreatedUpload>(),
  complete: (wid: string, id: string) => api.post(`${base(wid)}/${id}/complete`).json<Upload>(),
  get: (wid: string, id: string) => api.get(`${base(wid)}/${id}`).json<Upload>(),

  /** Create → PUT the bytes straight to object storage → complete. */
  async uploadFile(wid: string, file: File): Promise<Upload> {
    const created = await uploadsApi.create(wid, {
      fileName: file.name,
      contentType: file.type,
      sizeBytes: file.size,
    })
    try {
      // Presigned URL: no API cookies, no API prefix.
      await ky.put(created.uploadUrl, { body: file, headers: created.uploadHeaders, retry: 0, timeout: false })
    } catch (error) {
      throw toApiError(error)
    }
    return uploadsApi.complete(wid, created.upload.id)
  },
}
