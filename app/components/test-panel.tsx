import { Button } from "@/components/ui/button";
import { Panel } from "./panel";
import { Action, Integration, useIntegrationApp } from "@integration-app/react";
import { sortBy } from "lodash-es";

export function TestPanel({ integrations }: { integrations: Integration[] }) {
  const integrationApp = useIntegrationApp();

  const sortedIntegrations = sortBy(integrations, (i) => !i.connection);

  async function handleUpdateMapping(integration: Integration) {
    console.log("Integration", integration);
    await integrationApp
      .connection(integration.connection!.id)
      .fieldMapping("extended-contact-mapping")
      .openConfiguration();

    // Just using API, I had to call this the first time (Otherwise, get "no instance" error).
    // It probably can get auto-created using the "openConfiguration" call.
    // const createResult = await integrationApp
    //   .connection(integration.connection!.id)
    //   .fieldMapping("extended-contact-mapping")
    //   .create();
    // console.log("Create Result", createResult);

    // const result = await integrationApp
    //   .connection(integration.connection!.id)
    //   .fieldMapping("extended-contact-mapping")
    //   .get();
    // console.log("Field Mapping", result);
  }

  async function handleTestActions(integration: Integration) {
    console.log("Integration", integration);
    const actionsListResult = await integrationApp
      .connection(integration.connection!.id)
      .actions.list();

    // Note: fixing incorrect type
    const items = actionsListResult.items as unknown as Action[];

    for (const action of items) {
      console.log("Action", action);
    }

    const createContactAction = items.find(
      (a) => a.parent.key === "create-contact-2",
    );
    console.log("Create Contact Action", createContactAction);

    // const actionInstance = await integrationApp
    //   .connection(integration.connection!.id)
    //   .action(createContactAction!.id)
    //   .get();

    // console.log("Action Instance - BEFORE", actionInstance);

    // const actionInstanceAfter = await integrationApp
    //   .connection(integration.connection!.id)
    //   .action(createContactAction!.id)
    //   .setup();

    // console.log("Action Instance - AFTER", actionInstanceAfter);
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
              onClick={() => handleTestActions(integration)}
            >
              Test Actions
            </Button>

            <Button
              variant="secondary"
              onClick={() => handleUpdateMapping(integration)}
            >
              Update Mapping
            </Button>
          </div>
        ))}
      </div>
    </Panel>
  );
}
