"use client"

import React, { useState } from "react"
import { useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function RequestPasswordReset({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const searchParams = useSearchParams()
  const emailFromQuery = searchParams.get("email") || ""
  const [email, setEmail] = useState(emailFromQuery)

  const handleReset = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Hier kannst du die Authentifizierung oder weitere Logik einbauen
    console.log("E-Mail:", email)
    console.log("Reset form submitted")
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            Gib deine Email ein um das Passwort zurückzusetzen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleReset}>
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
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  zurücksetzen
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
