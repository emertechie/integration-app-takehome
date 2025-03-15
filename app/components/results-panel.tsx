import { Panel } from "./panel";
import { ContactResult } from "../types/contact-result";

interface ResultsPanelProps {
  resultsByIntegrationId: Record<string, ContactResult>;
}

export function ResultsPanel({ resultsByIntegrationId }: ResultsPanelProps) {
  return (
    <Panel title="Results" className="mt-8">
      <div className="space-y-4">
        {Object.keys(resultsByIntegrationId).length === 0 ? (
          <p className="text-sm text-gray-500">No results yet</p>
        ) : (
          Object.entries(resultsByIntegrationId).map(
            ([integrationId, result]) => (
              <div key={integrationId}>
                <h3 className="text-lg font-bold">{result.integration.name}</h3>

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
  );
}
