"use client"

import React, { ChangeEvent, useState } from "react"
import { cn } from "@/src/utils/utils"
import { Button } from "@/src/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { useAuth } from "@/src/state/AuthContext"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { login } = useAuth()
  const searchParams = useSearchParams()
  const emailFromQuery = searchParams.get("email") || ""
  const [email, setEmail] = useState(emailFromQuery)
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      toast.success("Erfolgreich eingeloggt")
    } catch {
      toast.error("Login fehlgeschlagen")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Gib deine Email-Adresse und dein Passwort ein, um dich anzumelden.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="max@mustermann.com"
                  required
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Passwort</Label>
                  <Link
                    href={`/auth/request-password-reset?email=${encodeURIComponent(
                      email
                    )}`}
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Passwort zurücksetzen
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Lädt..." : "Login"}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Hast du noch keinen Account?{" "}
              <Link
                href="/auth/signup"
                className="underline underline-offset-4"
              >
                Registrieren
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
