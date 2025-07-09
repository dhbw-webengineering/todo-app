"use client"

import React, { ChangeEvent, useState } from "react"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/src/components/ui/button"

export function PasswordField({ 
  id, name, label, placeholder, required = false, value, onChange, resetPasswordLink, className 
}: { 
  id: string; name: string; label?: string; placeholder?: string; required?: boolean; 
  value?: string; onChange?: (e: ChangeEvent<HTMLInputElement>) => void; 
  resetPasswordLink?: { href: string; text: string }; className?: string; 
}) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`grid gap-3 ${className}`}>
      {(label || resetPasswordLink) && (
        <div className="flex items-center">
          {label && <Label htmlFor={id}>{label}</Label>}
          {resetPasswordLink && <Link href={resetPasswordLink.href} className="ml-auto inline-block text-sm underline-offset-4 hover:underline">{resetPasswordLink.text}</Link>}
        </div>
      )}
      <div className="relative">
        <Input 
          id={id} 
          type={showPassword ? "text" : "password"} 
          name={name} 
          placeholder={placeholder} 
          required={required} 
          value={value} 
          onChange={onChange} 
          className="pr-10" 
        />
        <Button 
          type="button"
          variant="ghost" 
          size="icon"
          className="absolute right-0 top-0 h-full px-3 py-2" 
          onClick={togglePasswordVisibility}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
          <span className="sr-only">
            {showPassword ? "Passwort verbergen" : "Passwort anzeigen"}
          </span>
        </Button>
      </div>
    </div>
  )
}
