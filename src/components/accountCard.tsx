'use client'

import React, { ChangeEvent, useState } from "react"
import { Card, CardHeader, CardContent, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Mail, RectangleEllipsis, User } from "lucide-react"
import { ApiRoute } from "../utils/ApiRoute"
import fetcher from "../utils/fetcher"
import { toast } from "sonner"
import { useAuth } from "@/src/state/useAuth"
import { z } from "zod"
import { cn } from "@/src/utils/utils"

const AccountSchema = z
  .object({
    email: z.string().email("Ungültige E-Mail-Adresse"),
    password: z.string().min(6, "Passwort muss mindestens 6 Zeichen lang sein"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwörter stimmen nicht überein",
    path: ["confirmPassword"],
  })

export default function AccountCard() {
  const [editMode, setEditMode] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const { user } = useAuth()
  const [email, setEmail] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof z.infer<typeof AccountSchema>, string>>>({})

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const validated = AccountSchema.parse({ email, password, confirmPassword })

      await fetcher(ApiRoute.USER, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: validated.email,
          password: validated.password,
        }),
      })

      toast.success("Profil aktualisiert")
      setEditMode(false)
      setPassword("")
      setConfirmPassword("")
      setFieldErrors({})
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: Partial<Record<keyof z.infer<typeof AccountSchema>, string>> = {}
        err.errors.forEach(e => {
          const field = e.path[0] as keyof z.infer<typeof AccountSchema>
          errors[field] = e.message
        })
        setFieldErrors(errors)
        toast.error(err.errors[0].message)
      } else {
        console.error(err)
        toast.error("Ein unerwarteter Fehler ist aufgetreten.", {
          description: "Die E-Mail-Adresse wird möglicherweise schon verwendet.",})
      }
    }
  }

  if (!user) {
    return <div className="text-center p-4">Lade Benutzerinformationen...</div>
  }

  return (
    <Card className="max-w-md mx-auto shadow-lg border-2 border-gray-100">
      <CardHeader className="flex flex-col items-center pb-2">
        <User className="w-14 h-14 text-primary mb-2" />
        <CardTitle className="text-xl font-bold">Account</CardTitle>
      </CardHeader>
      <CardContent>
        {editMode ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Mail className="text-gray-400" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  className={cn("flex-1", fieldErrors.email && "border-red-500")}
                  placeholder="E-Mail"
                  required
                />
              </div>
              {fieldErrors.email && <p className="text-sm text-red-600">{fieldErrors.email}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <RectangleEllipsis className="text-gray-400" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  placeholder="Neues Passwort"
                  className={cn("flex-1", fieldErrors.password && "border-red-500")}
                />
              </div>
              {fieldErrors.password && <p className="text-sm text-red-600">{fieldErrors.password}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <RectangleEllipsis className="text-gray-400" />
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                  placeholder="Passwort wiederholen"
                  className={cn("flex-1", fieldErrors.confirmPassword && "border-red-500")}
                />
              </div>
              {fieldErrors.confirmPassword && <p className="text-sm text-red-600">{fieldErrors.confirmPassword}</p>}
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="w-1/2">
                Speichern
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-1/2"
                onClick={() => {
                  setEditMode(false)
                  setFieldErrors({})
                }}
              >
                Abbrechen
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="text-gray-400" />
              <span className="font-semibold">E-Mail:</span>
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <RectangleEllipsis className="text-gray-400" />
              <span className="font-semibold">Passwort:</span>
              <span>********</span>
            </div>
            <Button className="mt-4 w-full" onClick={() => setEditMode(true)}>
              Profil bearbeiten
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
