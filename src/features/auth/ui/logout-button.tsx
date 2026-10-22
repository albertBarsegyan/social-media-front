"use client"

import { LogOutIcon } from "lucide-react"
import { useRouter } from "next/navigation"

import { routes } from "@/shared/config"
import { Button } from "@/shared/ui/button"

import { useLogout } from "../api/mutations"

export function LogoutButton() {
  const router = useRouter()
  const logout = useLogout()
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Sign out"
      disabled={logout.isPending}
      // useLogout clears the query cache; the proxy no longer sees a session cookie.
      onClick={() => logout.mutate(undefined, { onSettled: () => router.replace(routes.login) })}
    >
      <LogOutIcon />
    </Button>
  )
}
