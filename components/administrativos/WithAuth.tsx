"use client";

import { useEffect, ComponentType } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";

export const WithAuth = (allowedRoles: string[]) => {
    return function ProtectedRoute<P extends object>(
        Component: ComponentType<P>
    ) {
        return function WrappedComponent(props: P) {
            const { user, role, loading } = useAuth();
            const router = useRouter();

            useEffect(() => {
                if (!loading && !user) {
                    router.push("/login");
                }

                if (!loading && user && role && !allowedRoles.includes(role)) {
                    router.push("/unauthorized");
                }
            }, [user, loading, role, router]);

            if (loading || !user || !allowedRoles.includes(role || "")) {
                return <div className="flex justify-center items-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>;
            }

            return <Component {...props} />;
        };
    };
};