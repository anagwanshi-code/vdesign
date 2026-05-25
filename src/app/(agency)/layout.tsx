import { AgencyShell } from "@/components/layout/AgencyShell";

export default function AgencyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AgencyShell>{children}</AgencyShell>;
}
