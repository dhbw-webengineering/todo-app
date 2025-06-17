import AccountCard from "@/components/accountCard";

export default function AccountPage() {
  

  return (
    <div className="flex min-h-full w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <AccountCard user={{email: "admin@todo"}}/>
      </div>
    </div>
  )
}
