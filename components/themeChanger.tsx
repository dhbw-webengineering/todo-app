"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon} from "lucide-react"; // Optional: Icons, falls du lucide-react installiert hast

const options = [
  { value: "dark", label: "Dark", icon: <Moon className="w-4 h-4 mr-2" /> },
  { value: "light", label: "Light", icon: <Sun className="w-4 h-4 mr-2" /> },
];

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const {resolvedTheme, setTheme} = useTheme();

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="inline-flex items-center rounded bg-zinc-100 dark:bg-zinc-800 px-2 py-1 ">
      {options.map((opt) => (
        <button
          key={opt.value}
          className={`flex items-center px-2 py-1 rounded transition-colors cursor-pointer
            ${resolvedTheme === opt.value
              ? "bg-zinc-300 dark:bg-zinc-700 font-semibold"
              : "hover:bg-zinc-200 dark:hover:bg-zinc-600"}
          `}
          onClick={() => setTheme(opt.value)}
          aria-pressed={resolvedTheme === opt.value}
        >
          {opt.icon}
          <span className="hidden sm:inline">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}
