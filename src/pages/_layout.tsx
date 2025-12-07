import "../styles.css";

import type { ReactNode } from "react";

type RootLayoutProps = { children: ReactNode };

export default async function RootLayout({ children }: RootLayoutProps) {
  const data = await getData();

  return (
    <div className="font-sans antialiased">
      <meta name="description" content={data.description} />
      <link rel="icon" type="image/png" href={data.icon} />
      {children}
    </div>
  );
}

const getData = async () => {
  const data = {
    description: "An internet website!",
    icon: "/images/favicon.png",
  };

  return data;
};

export const getConfig = async () => {
  return {
    render: "static",
  } as const;
};
