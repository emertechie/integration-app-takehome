import { NextResponse } from "next/server";
import { getIntegrationToken } from "@/lib/integration-app-auth";

export async function GET() {
  const token = getIntegrationToken({
    id: "acme-corp",
    name: "Acme Corp",
  });

  return NextResponse.json({ token });
}
