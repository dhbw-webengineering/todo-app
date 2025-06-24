import { ResetPassword } from "@/components/auth/resetPassword";

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-full w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ResetPassword />
      </div>
    </div>
  );
}