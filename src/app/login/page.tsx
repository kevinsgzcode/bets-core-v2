import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const session = await auth();
  const isDev = process.env.NODE_ENV === "development";

  if (session && !isDev) {
    redirect("/");
  }

  return <LoginForm />;
}
