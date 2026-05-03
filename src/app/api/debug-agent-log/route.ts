import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await fetch("http://127.0.0.1:7433/ingest/a7deb799-be3b-4325-9467-8eb2971285b2", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "d840a5",
    },
    body: JSON.stringify({
      sessionId: "d840a5",
      runId: "menu-overlay-diagnose-3",
      hypothesisId: "H8",
      location: "src/app/api/debug-agent-log/route.ts:GET",
      message: "relay_get_probe",
      data: { ok: true },
      timestamp: Date.now(),
    }),
    cache: "no-store",
  }).catch(() => {});
  return NextResponse.json({ ok: true, probe: "logged" });
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    await fetch("http://127.0.0.1:7433/ingest/a7deb799-be3b-4325-9467-8eb2971285b2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "d840a5",
      },
      body: JSON.stringify({
        sessionId: "d840a5",
        runId: "menu-overlay-diagnose-2",
        hypothesisId: "H7",
        location: "src/app/api/debug-agent-log/route.ts:POST",
        message: "relay_received_payload",
        data: {
          hasSession: Boolean(payload?.sessionId),
          message: payload?.message ?? null,
          location: payload?.location ?? null,
        },
        timestamp: Date.now(),
      }),
      cache: "no-store",
    }).catch(() => {});

    await fetch("http://127.0.0.1:7433/ingest/a7deb799-be3b-4325-9467-8eb2971285b2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "d840a5",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    }).catch(() => {});
  } catch (error) {
    await fetch("http://127.0.0.1:7433/ingest/a7deb799-be3b-4325-9467-8eb2971285b2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "d840a5",
      },
      body: JSON.stringify({
        sessionId: "d840a5",
        runId: "menu-overlay-diagnose-2",
        hypothesisId: "H7",
        location: "src/app/api/debug-agent-log/route.ts:catch",
        message: "relay_parse_or_forward_error",
        data: { error: error instanceof Error ? error.message : String(error) },
        timestamp: Date.now(),
      }),
      cache: "no-store",
    }).catch(() => {});
  }
  return NextResponse.json({ ok: true });
}
