import { redirect } from "@/shared/router/router";

export default async function DashboardPage() {
  return redirect("/dashboard/monthly");
}

export const getConfig = async () => {
  return {
    render: "dynamic",
  } as const;
};
