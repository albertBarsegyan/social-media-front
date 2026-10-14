"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { errorMessage } from "@/shared/api"
import { routes } from "@/shared/config"
import { Alert, AlertDescription } from "@/shared/ui/alert"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"

import { useRegister } from "../api/mutations"
import { AuthCard } from "./auth-card"

const MIN_PASSWORD = 8

export function RegisterForm() {
  const router = useRouter()
  const register = useRegister()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <AuthCard
      title="Create your account"
      description="Then set up your first client workspace."
      footer={
        <>
          Already have an account?{" "}
          <Link href={routes.login} className="font-medium text-foreground underline underline-offset-3">
            Sign in
          </Link>
        </>
      }
    >
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault()
          register.mutate({ name, email, password }, { onSuccess: () => router.replace(routes.onboarding) })
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="register-name">Name</Label>
          <Input id="register-name" autoComplete="name" required maxLength={100} value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="register-email">Email</Label>
          <Input id="register-email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="register-password">Password</Label>
          <Input
            id="register-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={MIN_PASSWORD}
            maxLength={128}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">At least {MIN_PASSWORD} characters.</p>
        </div>
        {register.isError ? (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage(register.error)}</AlertDescription>
          </Alert>
        ) : null}
        <Button type="submit" className="w-full" disabled={register.isPending}>
          {register.isPending ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </AuthCard>
  )
}
