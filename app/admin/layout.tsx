"use client";
import { WithAuth } from "@/components/administrativos/WithAuth";
import Sidebar from "@/components/administrativos/Sidebar";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex">
            <Sidebar />
            {children}
        </div>
    );
}

export default WithAuth(["ADMINISTRADOR"])(AdminLayoutContent);