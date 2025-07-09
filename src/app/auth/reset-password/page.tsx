"use client";

import React from "react";
import { ResetPassword } from "@/src/components/auth/resetPassword";
import { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-full w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Suspense>
          <ResetPassword />
        </Suspense>
      </div>
    </div>
  );
}