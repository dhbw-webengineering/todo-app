"use client"

import React, { ChangeEvent, useState } from "react"
import { useSearchParams } from "next/navigation"
import { cn } from "@/src/utils/utils"
import { Button } from "@/src/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { toast } from "sonner"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { ApiRoute } from "@/src/utils/ApiRoute"

export function RequestPasswordReset({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const searchParams = useSearchParams()
  const emailFromQuery = searchParams.get("email") || ""
  const [email, setEmail] = useState(emailFromQuery)
  const [success, setSuccess] = useState(false)

  const handleReset = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    fetch(ApiRoute.RESET_PASSWORD_REQUEST, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
      credentials: "include",
    })
      .then(response => {
        if (response.ok) {
          setSuccess(true)
          toast.success(
            "Eine E-Mail zum Zurücksetzen des Passworts wurde gesendet, falls die E-Mail-Adresse registriert ist.",
            { duration: 3000 }
          )
        } else {
          toast.error(
            "Fehler beim Senden der E-Mail zum Zurücksetzen des Passworts.",
            { duration: 3000 }
          )
        }
      })
      .catch(() => {
        toast.error(
          "Fehler beim Senden der E-Mail zum Zurücksetzen des Passworts. Bitte versuche es später erneut.",
          { duration: 3000 }
        )
      })
  }

  if (success) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="flex flex-col items-center gap-2">
            <CheckCircle2 className="text-green-500 w-12 h-12" />
            <CardTitle>Passwort-Reset angefordert</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <p>
              Wenn die E-Mail-Adresse registriert ist, erhältst du in Kürze eine E-Mail mit weiteren Anweisungen.
            </p>
            <div className="mt-6 flex justify-end w-full">
              <Link href="/login">
                <Button variant="outline" className="gap-2">
                  <span>Zum Login</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Passwort zurücksetzen</CardTitle>
          <CardDescription>
            Gib deine E-Mail ein, um das Passwort zurückzusetzen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleReset}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">E-Mail</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="max@mustermann.com"
                  required
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Zurücksetzen
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
