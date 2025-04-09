import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils"; // Necesitarás crear esta utilidad
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";

const Tabs = TabsPrimitive.Root;

const TabsList = forwardRef<
    ElementRef<typeof TabsPrimitive.List>,
    ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.List
        ref={ref}
        className={cn(
            "inline-flex items-center justify-center rounded-md bg-gray-800 p-1",
            className
        )}
        {...props}
    />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = forwardRef<
    ElementRef<typeof TabsPrimitive.Trigger>,
    ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
        ref={ref}
        className={cn(
            "inline-flex min-w-[100px] items-center justify-center rounded-[0.185rem] px-3 py-1.5 text-sm font-medium",
            "text-gray-300 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
            "data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm",
            className
        )}
        {...props}
    />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = forwardRef<
    ElementRef<typeof TabsPrimitive.Content>,
    ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Content
        ref={ref}
        className={cn(
            "mt-2 rounded-md border border-gray-700 bg-gray-800 p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
            className
        )}
        {...props}
    />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };