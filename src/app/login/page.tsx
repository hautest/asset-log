import { redirect } from "next/navigation";
import { getSession } from "@/shared/auth/getSession";

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    redirect("/dashboard/monthly");
  }

  redirect("/dashboard/monthly?login=true");
}
