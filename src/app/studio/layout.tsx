import type { ReactNode } from "react";

type StudioLayoutProps = {
  children: ReactNode;
};

export default function StudioLayout({ children }: StudioLayoutProps) {
  return (
    <div className="h-[100dvh] max-h-[100dvh] overflow-hidden">{children}</div>
  );
}
