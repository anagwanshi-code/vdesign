import type { ReactNode } from "react";

type ShopShellProps = {
  children: ReactNode;
};

export function ShopShell({ children }: ShopShellProps) {
  return <div className="flex min-h-full flex-1 flex-col pt-16">{children}</div>;
}
