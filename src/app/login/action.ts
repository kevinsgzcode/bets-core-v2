"use server";
import { signIn } from "@/auth";

export async function authenticate(
  _prevState: string | undefined,
  formData: FormData
) {
  const email = formData.get("email");

  if (!email || typeof email !== "string") {
    return "Invalid email address";
  }

  try {
    await signIn("email", {
      email,
      redirect: false,
    });
  } catch (error) {
    return "Something went wrong. Please try again";
  }

  return undefined;
}
