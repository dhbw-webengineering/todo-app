"use client"

import React, { useState } from "react"
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
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
<<<<<<< feature/-middleware
import { toast } from "sonner"
=======
>>>>>>> main

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {

<<<<<<< feature/-middleware
    const router = useRouter()
=======
    const router = useRouter()  
>>>>>>> main

    const searchParams = useSearchParams()
    const emailFromQuery = searchParams.get("email") || ""
    const [email, setEmail] = useState(emailFromQuery)

    const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const email = formData.get("email")
        const password = formData.get("password")
<<<<<<< feature/-middleware

        const api = fetch("http://localhost:3001/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password }),
            credentials: "include"
        })
        api.then(async response => {
            if (response.ok) {
                router.push("/")
            } else {
                const data = await response.json();
                toast.error("Login fehlgeschlagen", {
                    duration: 3000,
                    description: data.message || "Unbekannter Fehler"
                });


=======
        // Hier kannst du die Authentifizierung oder weitere Logik einbauen
        console.log("E-Mail:", email)
        console.log("Passwort:", password)
        console.log("Login form submitted")
        
        const api = fetch("http://localhost:3001/login", {
            method: "POST",
            headers: {  
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password }),
            credentials: "include" // Wichtig für Cookies
        })
        api.then(async response => {
            if (response.ok) {
                console.log("Login successful")
                router.push("/") 
            } else {
                console.error("Login failed")
                console.log("Response status:", response.status)
                // Hier kannst du eine Fehlermeldung anzeigen
>>>>>>> main
            }
        })
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
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
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Passwort</Label>
                                    <Link
                                        href={`/auth/request-password-reset?email=${encodeURIComponent(email)}`}
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Passwort zurücksetzen
                                    </Link>
                                </div>
                                <Input id="password" type="password" name="password" required />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Button type="submit" className="w-full">
                                    Login
                                </Button>
                            </div>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Haben sie keinen Account?{" "}
                            <Link href="/auth/signup" className="underline underline-offset-4">
                                registrieren
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
