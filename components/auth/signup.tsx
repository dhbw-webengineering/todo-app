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
import { useRouter } from "next/navigation"
import { toast } from "sonner"


export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

const router = useRouter()

  const handleSignup = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const email = formData.get("email")
    const password = formData.get("password")

    
    const api = fetch("http://localhost:3001/register", {
            method: "POST",
            headers: {  
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        })
        api.then(response => {
            if (response.ok) {
                console.log("Signup successful")
                 router.push("/auth/login?email=" + encodeURIComponent(email as string))
                 toast.success("Erfolgreich registriert", {
                   duration: 3000,
                 });
              } else {
                console.error("Signup failed")
                console.log("Response status:", response.status)
                toast.error("Fehler bei der Registrierung", {
                   duration: 3000,
                 });
            }
        })

  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Registrieren</CardTitle>
          <CardDescription>
            Gib diene Email und Passwort ein um dich zu registrieren
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="max@mustermann.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Passwort</Label>
                </div>
                <Input id="password" type="password" name="password" required placeholder="Passwort" />
              </div>
              <div>
                <Input id="password2" type="password" name="password2" placeholder="Passwort wiederholen" required />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  registrieren
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
