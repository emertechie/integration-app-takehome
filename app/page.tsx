"use client";
import { IntegrationsPanel } from "./components/integrations-panel";
import { ContactFormPanel } from "./components/contact-form-panel";
import { useIntegrations } from "@integration-app/react";
import { useState } from "react";
import { ResultsPanel } from "./components/results-panel";
import { ContactResult } from "./types/contact-result";

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
      <ResultsPanel resultsByIntegrationId={resultsByIntegrationId} />
    </div>
  );
}
