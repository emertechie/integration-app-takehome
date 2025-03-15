"use client";
import { Panel } from "./components/panel";
import { IntegrationsPanel } from "./components/integrations-panel";
import {
  ContactFormPanel,
  ContactResult,
} from "./components/contact-form-panel";
import { useIntegrations } from "@integration-app/react";
import { useState } from "react";

export default function Page() {
  const {
    integrations,
    loading: integrationsIsLoading,
    error,
  } = useIntegrations();

  const [resultsByIntegrationId, setResultsByIntegrationId] = useState<
    Record<string, ContactResult>
  >({});

  function handleContactResult(result: ContactResult) {
    console.log("handleContactResult", result);

    setResultsByIntegrationId((prev) => ({
      ...prev,
      [result.integration.id]: result,
    }));
  }

  return (
    <div className="flex flex-col items-center py-12">
      {/* Integrations Panel */}
      <IntegrationsPanel
        integrations={integrations}
        loading={integrationsIsLoading}
        error={error}
      />

      {/* Contact Form Panel */}
      {!integrationsIsLoading && !error && (
        <ContactFormPanel
          integrations={integrations}
          onContactResult={handleContactResult}
        />
      )}

      {/* Results Panel */}
      <Panel title="Results" className="mt-8">
        <div className="space-y-4">
          {Object.keys(resultsByIntegrationId).length === 0 ? (
            <p className="text-sm text-gray-500">No results yet</p>
          ) : (
            Object.entries(resultsByIntegrationId).map(
              ([integrationId, result]) => (
                <div key={integrationId}>
                  <h3 className="text-lg font-bold">
                    {result.integration.name}
                  </h3>

                  {result.status === "pending" ? (
                    <p>Pending...</p>
                  ) : result.status === "success" ? (
                    <p>
                      <span className="mr-1">Success.</span>
                      <a
                        className="text-blue-500"
                        href={result.contact.uri}
                        target="_blank"
                      >
                        View new contact
                      </a>
                    </p>
                  ) : (
                    <p className="overflow-wrap-anywhere break-all">
                      Error: {result.error.message}
                    </p>
                  )}
                </div>
              ),
            )
          )}
        </div>
      </Panel>
    </div>
  );
}
