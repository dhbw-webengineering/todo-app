"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ResetPassword } from "@/components/auth/resetPassword";

export default function ResetPasswordPage() {
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      fetch(`http://localhost:3001/reset-password-token-verify?token=${token}`)
        .then((response) => setIsValidToken(response.status === 200))
        .catch(() => setIsValidToken(false));
    } else {
      setIsValidToken(false);
    }
  }, [token]);

  if (isValidToken === null) return <div>Lade...</div>;
  if (!isValidToken)
    return (
      <div>
        Link zum Passwort zurücksetzen ist ungültig oder abgelaufen.
      </div>
    );

  return (
    <div className="flex min-h-full w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Suspense fallback={<div>Lade...</div>}>
          <ResetPassword token={token!} />
        </Suspense>
      </div>
    </div>
  );
}