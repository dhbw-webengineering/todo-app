import { RequestPasswordReset } from "@/src/components/auth/requestPasswordReset"

export default function LoginPage() {
  

  return (
    <div className="flex min-h-full w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <RequestPasswordReset 
         />
      </div>
    </div>
  )
}
