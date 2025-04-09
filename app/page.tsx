import { redirect } from "next/navigation";

export default function Home() {
    redirect("/menu");
    return null;
}
