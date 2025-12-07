export default function DashboardPage() {
  return <div>DashboardPage</div>;
}

export const getConfig = async () => {
  return {
    render: "dynamic",
  } as const;
};
