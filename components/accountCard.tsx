"use client"
import React, { useState } from "react"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, RectangleEllipsis, User } from "lucide-react"

export default function AccountCard({ user }: { user: { email: string } }) {
  const [editMode, setEditMode] = useState(false)
  const [email, setEmail] = useState(user.email)
  const [password, setPassword] = useState("")

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    // Hier könntest du die neuen Werte an ein Backend schicken
    setEditMode(false)
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
            <div className="flex items-center gap-2">
              <Mail className="text-gray-400" />
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="flex-1"
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <RectangleEllipsis className="text-gray-400" />
              <Input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Neues Passwort"
                className="flex-1"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="w-1/2">
                Speichern
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-1/2"
                onClick={() => setEditMode(false)}
              >
                Abbrechen
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="text-gray-400" />
              <span className="font-semibold">Email:</span>
              <span>{email}</span>
            </div>
            <div className="flex items-center gap-2">
              <RectangleEllipsis className="text-gray-400" />
              <span className="font-semibold">Passwort:</span>
              <span>********</span>
            </div>
            <Button
              className="mt-4 w-full"
              onClick={() => setEditMode(true)}
            >
              Profil bearbeiten
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
