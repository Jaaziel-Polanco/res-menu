// components/ui/input.tsx
"use client";
import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";


const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
    ({ className, type = "text", ...props }, ref) => {
        return (
            <input
                type={type}
                ref={ref}
                className={cn(
                    "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm",
                    "ring-offset-white focus:outline-none focus:ring-2 focus:ring-blue-500",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                {...props}
            />
        );
    }
);
Input.displayName = "Input";

export { Input };