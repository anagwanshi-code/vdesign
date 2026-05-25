import type { ReactNode } from "react";

type AgencyShellProps = {
  children: ReactNode;
};

export function AgencyShell({ children }: AgencyShellProps) {
  return <div className="flex min-h-full flex-1 flex-col pt-16">{children}</div>;
}
