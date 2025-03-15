import { ReactNode } from "react";

interface PanelProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function Panel({ title, subtitle, children, className }: PanelProps) {
  return (
    <div
      className={`flex w-full max-w-xl flex-col rounded-lg bg-white p-4 ${className || ""}`}
    >
      <h1 className="text-2xl font-bold">{title}</h1>
      {subtitle && <h3 className="text-sm text-gray-500">{subtitle}</h3>}
      <div className="mt-4">{children}</div>
    </div>
  );
}
