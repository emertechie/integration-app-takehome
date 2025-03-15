"use client";

import { IntegrationAppProvider } from "@integration-app/react";

const fetchToken = async () => {
  const response = await fetch("/api/integration-app-token");
  const data = await response.json();
  return data.token as string;
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <IntegrationAppProvider fetchToken={fetchToken}>
      {children}
    </IntegrationAppProvider>
  );
}
