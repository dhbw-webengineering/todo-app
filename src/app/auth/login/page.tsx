import { LoginForm } from "@/src/components/auth/login"
import { Suspense } from "react"

export default function LoginPage() {

  return (
    <div className="flex min-h-full w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
