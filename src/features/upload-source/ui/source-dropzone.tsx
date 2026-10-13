"use client"

import { UploadIcon } from "lucide-react"
import { useRef } from "react"

import { toast } from "@/shared/lib/toast"

/** Drop a case study, photos or video to repurpose. Upload itself is not wired yet. */
export function SourceDropzone() {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault()
        toast(`${event.dataTransfer.files.length} file(s) ready to upload`)
      }}
      className="flex w-full flex-col items-center gap-1 rounded-xl border border-dashed p-5 text-center hover:bg-muted/50"
    >
      <UploadIcon className="size-5 text-muted-foreground" />
      <span className="text-sm font-medium">Drop a case study, photos or video</span>
      <span className="text-xs text-muted-foreground">PDF, DOCX, JPG, MP4 · up to 200 MB</span>
      <input
        ref={inputRef}
        type="file"
        multiple
        hidden
        accept=".pdf,.docx,image/jpeg,video/mp4"
        onChange={(event) => toast(`${event.target.files?.length ?? 0} file(s) ready to upload`)}
      />
    </button>
  )
}
