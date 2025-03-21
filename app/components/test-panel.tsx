import { Button } from "@/components/ui/button";
import { Panel } from "./panel";
import { Integration, useIntegrationApp } from "@integration-app/react";
import { sortBy } from "lodash-es";

export function TestPanel({ integrations }: { integrations: Integration[] }) {
  const integrationApp = useIntegrationApp();

  const sortedIntegrations = sortBy(integrations, (i) => !i.connection);

  async function handleClick(integration: Integration) {
    console.log(integration);

    // await integrationApp
    //   .connection("{INTEGRATION_KEY}")
    //   .fieldMapping("{FIELD_MAPPING_KEY}")
    //   .openConfiguration();
  }

  return (
    <Panel title="Test" className="mt-8">
      <div className="space-y-4">
        {sortedIntegrations.map((integration) => (
          <div
            className="flex items-center justify-between gap-2 rounded-lg border p-4"
            key={integration.id}
          >
            {integration.name} (key: {integration.key}, id: {integration.id})
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
