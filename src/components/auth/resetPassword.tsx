"use client";

import React, { useState } from "react";
import { cn } from "@/src/utils/utils";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react"; // Checkmark mit Kreis
import { ApiRoute } from "@/src/utils/ApiRoute";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function ResetPassword({ className, ...props }: React.ComponentProps<"div">) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      fetch(`${ApiRoute.RESET_PASSWORD_TOKEN_VERIFY}?token=${token}`)
        .then((response) => setIsValidToken(response.status === 200))
        .catch(() => setIsValidToken(false));
    } else {
      setIsValidToken(false);
    }
  }, [token]);

  const handleReset = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const password = formData.get("password") as string;
    const password2 = formData.get("password2") as string;

    if (!password || password.length < 6) {
      toast.error("Das Passwort muss mindestens 6 Zeichen lang sein", { duration: 3000 });
      return;
    }
    if (password !== password2) {
      toast.error("Die Passwörter stimmen nicht überein", { duration: 3000 });
      return;
    }

    try {
      const response = await fetch(ApiRoute.RESET_PASSWORD, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      if (response.ok) {
        setSuccess(true);
        toast.success("Passwort erfolgreich zurückgesetzt!", { duration: 3000 });
      } else {
        const data = await response.json();
        setError(data.message || "Fehler beim Zurücksetzen des Passworts.");
        toast.error(data.message || "Fehler beim Zurücksetzen des Passworts.", { duration: 3000 });
      }
    } catch {
      setError("Netzwerkfehler. Bitte versuche es später erneut.");
      toast.error("Netzwerkfehler. Bitte versuche es später erneut.", { duration: 3000 });
    }
  };

  if (isValidToken === null) return <div>Lade...</div>;
    if (!isValidToken)
      return (
        <div>
          Link zum Passwort zurücksetzen ist ungültig oder abgelaufen.
        </div>
      );

  if (success) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="flex flex-col items-center gap-2">
            <CheckCircle2 className="text-green-500 w-12 h-12" />
            <CardTitle>Passwort erfolgreich zurückgesetzt!</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <p>Du kannst dich jetzt mit deinem neuen Passwort anmelden.</p>
            <div className="mt-6 flex justify-end">
              <Link href={"/login"}>
                <Button variant="outline" className="gap-2">
                  <span>Zum Login</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader>
            <CardTitle>Fehler</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="mt-6 flex justify-end">
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
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Passwort Zurücksetzen</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleReset}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="password">Neues Passwort</Label>
                <Input id="password" type="password" name="password" required placeholder="Passwort" />
                <Label htmlFor="password2">Passwort wiederholen</Label>
                <Input id="password2" type="password" name="password2" required placeholder="Passwort wiederholen" />
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
  );
}
