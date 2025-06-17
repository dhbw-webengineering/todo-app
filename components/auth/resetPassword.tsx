"use client"

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

export function ResetPassword({
  className,
  ...props
}: React.ComponentProps<"div">) {


  const handleSignup = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const email = formData.get("email")
    const password = formData.get("password")
    // Hier kannst du die Authentifizierung oder weitere Logik einbauen
    console.log("E-Mail:", email)
    console.log("Passwort:", password)
    console.log("Login form submitted")
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Passwort Zurücksetzen</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">neues Passwort</Label>
                </div>
                <Input id="password" type="password" name="password" required placeholder="Passwort" />
                <div className="flex items-center">
                  <Label htmlFor="password">Passwort wiederholen</Label>
                </div>
                <Input id="password2" type="password" name="password2" placeholder="Passwort wiederholen" required />
              </div>

              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Passwort zurücksetzen
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
