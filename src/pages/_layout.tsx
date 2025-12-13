import "../styles.css";

import type { ReactNode } from "react";

import { DefaultMeta } from "../shared/components/DefaultMeta";
import { Toaster } from "../shared/ui/sonner";

type RootLayoutProps = { children: ReactNode };

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="font-sans antialiased">
      <DefaultMeta />
      {children}
      <Toaster />
    </div>
  );
}

export const getConfig = async () => {
  return {
    render: "dynamic",
  } as const;
};
