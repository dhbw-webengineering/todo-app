"use client"

import { useState } from "react"
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
import { toast } from "sonner"
import Link from "next/link"
import { CheckCircle2, ArrowRight } from "lucide-react"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    const formData = new FormData(event.currentTarget)
    const emailValue = formData.get("email") as string
    const password = formData.get("password") as string
    const password2 = formData.get("password2") as string

    // Passwort-Länge prüfen
    if (!password || password.length < 6) {
      toast.error("Das Passwort muss mindestens 6 Zeichen lang sein", {
        duration: 3000,
      })
      return
    }

    // Passwort-Wiederholung prüfen
    if (password !== password2) {
      toast.error("Die Passwörter stimmen nicht überein", {
        duration: 3000,
      })
      return
    }

    try {
      const response = await fetch("http://localhost:3001/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: emailValue, password })
      })

      if (response.ok) {
        setSuccess(true)
        setEmail(emailValue)
        toast.success("Erfolgreich registriert", { duration: 3000 })
      } else {
        const data = await response.json();
        setError(data.message || "Unbekannter Fehler")
        toast.error("Fehler bei der Registrierung", {
          duration: 3000,
          description: data.message || "Unbekannter Fehler"
        });
      }
    } catch (error) {
      setError("Netzwerkfehler")
      toast.error("Netzwerkfehler", { duration: 3000 })
    }
  }

  if (success) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="flex flex-col items-center gap-2">
            <CheckCircle2 className="text-green-500 w-12 h-12" />
            <CardTitle>Registrierung erfolgreich!</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <p>Du kannst dich jetzt mit deiner E-Mail anmelden.</p>
            <div className="mt-6 flex justify-end w-full">
              <Link href={`/auth/login?email=${encodeURIComponent(email)}`}>
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
          <CardTitle>Registrieren</CardTitle>
          <CardDescription>
            Gib deine E-Mail und Passwort ein, um dich zu registrieren
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">E-Mail</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="max@mustermann.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Passwort</Label>
                <Input id="password" type="password" name="password" required placeholder="Passwort" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password2">Passwort wiederholen</Label>
                <Input id="password2" type="password" name="password2" placeholder="Passwort wiederholen" required />
              </div>
              {error && (
                <div className="text-red-600 text-sm">{error}</div>
              )}
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Registrieren
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
