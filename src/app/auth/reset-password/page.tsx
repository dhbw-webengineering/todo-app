"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ResetPassword } from "@/src/components/auth/resetPassword";
import { ApiRoute } from "@/src/utils/ApiRoute";

export default function ResetPasswordPage() {
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
        <ResetPassword token={token!} />
      </div>
    </div>
  );
}