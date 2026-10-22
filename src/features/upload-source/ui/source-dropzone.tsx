"use client"

import { UploadIcon } from "lucide-react"
import { useRef } from "react"

import { useCatalog } from "@/entities/catalog"
import type { Upload } from "@/shared/api"
import { toast } from "@/shared/lib/toast"
import { cn } from "@/shared/lib/utils"

import { useUploadFiles } from "../api/mutations"

const MB = 1024 * 1024

/** Drop a case study, photos or video. Files go straight to storage; `onUploaded` gets the ready uploads. */
export function SourceDropzone({ wid, onUploaded }: { wid: string; onUploaded: (uploads: Upload[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const rules = useCatalog().data?.upload
  const upload = useUploadFiles(wid)

  const accept = (files: File[]) => {
    if (!rules || files.length === 0) return
    const rejected = files.filter((file) => !rules.contentTypes.includes(file.type) || file.size > rules.maxBytes)
    if (rejected.length) toast.error(`Skipped ${rejected.map((file) => file.name).join(", ")} — unsupported type or too large`)
    const valid = files.filter((file) => !rejected.includes(file))
    if (valid.length) {
      upload.mutate(valid, {
        onSuccess: (uploads) => {
          onUploaded(uploads)
          toast(`${uploads.length} file${uploads.length === 1 ? "" : "s"} uploaded`)
        },
      })
    }
  }

  return (
    <button
      type="button"
      disabled={upload.isPending || !rules}
      onClick={() => inputRef.current?.click()}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault()
        accept(Array.from(event.dataTransfer.files))
      }}
      className={cn(
        "flex w-full flex-col items-center gap-1 rounded-xl border border-dashed p-5 text-center hover:bg-muted/50",
        upload.isPending && "animate-pulse",
      )}
    >
      <UploadIcon className="size-5 text-muted-foreground" />
      <span className="text-sm font-medium">{upload.isPending ? "Uploading…" : "Drop a case study, photos or video"}</span>
      <span className="text-xs text-muted-foreground">
        PDF, DOCX, JPG, PNG, MP4{rules ? ` · up to ${Math.round(rules.maxBytes / MB)} MB` : ""}
      </span>
      <input
        ref={inputRef}
        type="file"
        multiple
        hidden
        accept={rules?.contentTypes.join(",")}
        onChange={(event) => {
          accept(Array.from(event.target.files ?? []))
          event.target.value = ""
        }}
      />
    </button>
  )
}
