"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

import { errorMessage } from "@/shared/api"
import { routes } from "@/shared/config"
import { Alert, AlertDescription } from "@/shared/ui/alert"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"

import { useLogin } from "../api/mutations"
import { safeNext } from "../lib/safe-next"
import { AuthCard } from "./auth-card"

export function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const login = useLogin()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <AuthCard
      title="Sign in"
      description="Find buyers, approve replies and posts, and see what brings in deals."
      footer={
        <>
          No account yet?{" "}
          <Link href={routes.register} className="font-medium text-foreground underline underline-offset-3">
            Create one
          </Link>
        </>
      }
    >
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault()
          login.mutate({ email, password }, { onSuccess: () => router.replace(safeNext(params.get("next"))) })
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="login-email">Email</Label>
          <Input id="login-email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="login-password">Password</Label>
          <Input
            id="login-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {login.isError ? (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage(login.error)}</AlertDescription>
          </Alert>
        ) : null}
        <Button type="submit" className="w-full" disabled={login.isPending}>
          {login.isPending ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </AuthCard>
  )
}
