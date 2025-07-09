"use client"

import React, { ChangeEvent } from "react"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import Link from "next/link"

export function PasswordField({ 
  id, name, label, placeholder, required = false, value, onChange, resetPasswordLink, className 
}: { 
  id: string; name: string; label?: string; placeholder?: string; required?: boolean; 
  value?: string; onChange?: (e: ChangeEvent<HTMLInputElement>) => void; 
  resetPasswordLink?: { href: string; text: string }; className?: string; 
}) {
  return (
    <div className={`grid gap-3 ${className}`}>
      {(label || resetPasswordLink) && (
        <div className="flex items-center">
          {label && <Label htmlFor={id}>{label}</Label>}
          {resetPasswordLink && <Link href={resetPasswordLink.href} className="ml-auto inline-block text-sm underline-offset-4 hover:underline">{resetPasswordLink.text}</Link>}
        </div>
      )}
      <Input id={id} type="password" name={name} placeholder={placeholder} required={required} value={value} onChange={onChange} />
    </div>
  )
}
