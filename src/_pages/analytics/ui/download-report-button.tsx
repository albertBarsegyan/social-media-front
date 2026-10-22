"use client"

import { toast } from "@/shared/lib/toast"
import { Button } from "@/shared/ui/button"

export function DownloadReportButton() {
  return (
    <Button size="sm" variant="outline" onClick={() => toast("PDF export isn’t available in the prototype yet")}>
      Download PDF
    </Button>
  )
}
