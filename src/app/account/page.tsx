"use client"
import AccountCard from "@/src/components/AccountCard";
import { useProtectedRoute } from "@/src/state/useProtectedRoute";

export default function AccountPage() {
  useProtectedRoute()
  return (
    <div className="flex min-h-full w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <AccountCard />
      </div>
    </div>
  )
}
