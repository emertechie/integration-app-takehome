import { Button } from "@/components/ui/button";
import { Panel } from "./panel";
import { Integration, useIntegrationApp } from "@integration-app/react";
import Image from "next/image";

interface IntegrationsPanelProps {
  integrations: Integration[];
  loading: boolean;
  error: Error | null;
}

export function IntegrationsPanel({
  integrations,
  loading: integrationsIsLoading,
  error,
}: IntegrationsPanelProps) {
  const integrationApp = useIntegrationApp();

  return (
    <Panel title="Intergrations" subtitle="Where new contacts will be created">
      {integrationsIsLoading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {integrations.map((integration) => (
        <div
          key={integration.id}
          className="mb-4 flex items-center justify-between rounded-lg border p-4"
        >
          <div className="flex items-center gap-3">
            {integration.logoUri && (
              <Image
                src={integration.logoUri}
                alt={`${integration.name} logo`}
                width={32}
                height={32}
                className="object-contain"
              />
            )}
            <span className="font-medium">{integration.name}</span>
          </div>
          <Button
            variant={integration.connection ? "destructive" : "default"}
            onClick={async () => {
              if (integration.connection) {
                console.log("disconnecting", integration.connection.id);
                await integrationApp
                  .connection(integration.connection.id)
                  .archive();
                console.log("disconnected", integration.connection.id);
              } else {
                console.log("connecting", integration.key);
                const connection = await integrationApp
                  .integration(integration.key)
                  .openNewConnection();
                console.log("connected", connection);
              }
            }}
          >
            {integration.connection ? "Disconnect" : "Connect"}
          </Button>
        </div>
      ))}
    </Panel>
  );
}
