import { Button } from "@/components/ui/button";
import { Panel } from "./panel";
import { Integration, useIntegrationApp } from "@integration-app/react";
import { sortBy } from "lodash-es";

export function TestPanel({ integrations }: { integrations: Integration[] }) {
  const integrationApp = useIntegrationApp();

  const sortedIntegrations = sortBy(integrations, (i) => !i.connection);

  async function handleClick(integration: Integration) {
    console.log("Integration", integration);

    const result = await integrationApp
      .connection(integration.connection!.id)
      .fieldMapping("extended-contact-mapping")
      .get();
    console.log("Field Mapping", result);

    await integrationApp
      .connection(integration.connection!.id)
      .fieldMapping("extended-contact-mapping")
      .openConfiguration();
  }

  return (
    <Panel title="Test" className="mt-8">
      <div className="space-y-4">
        {sortedIntegrations.map((integration) => (
          <div
            className="flex items-center justify-between gap-2 rounded-lg border p-4"
            key={integration.id}
          >
            <div className="flex flex-col gap-1">
              <p>{integration.name}</p>
              <p className="text-muted-foreground text-sm">
                key: {integration.key}, id: {integration.id}
              </p>
            </div>

            <Button
              variant="secondary"
              onClick={() => handleClick(integration)}
            >
              Test
            </Button>
          </div>
        ))}
      </div>
    </Panel>
  );
}
