// components/ui/button.tsx
"use client";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "secondary" | "outline" | "ghost";
    size?: "default" | "sm";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                    variant === "default" && "bg-blue-600 text-white hover:bg-blue-700",
                    variant === "secondary" && "bg-gray-200 text-gray-900 hover:bg-gray-300",
                    variant === "outline" && "border border-gray-300 bg-transparent hover:bg-gray-50",
                    variant === "ghost" && "hover:bg-gray-100",
                    size === "default" && "h-10 px-4 py-2",
                    size === "sm" && "h-9 px-3",
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button };