// app/api/resumes/route.ts
import { NextResponse } from "next/server";

const API_BASE = process.env.API_BASE_URL ?? "http://localhost:8043";

export async function GET() {
  try {
    const upstream = `${API_BASE}/api/resumes?limit=1000&skip=0`;
    const resp = await fetch(upstream, { cache: "no-store" });

    const text = await resp.text();
    const ct = resp.headers.get("content-type") || "";

    // 백엔드가 JSON이면 그대로 JSON으로 전달
    if (ct.includes("application/json")) {
      return new NextResponse(text, {
        status: resp.status,
        headers: { "content-type": "application/json" },
      });
    }
    // JSON이 아니어도 원문 그대로 전달(에러 메시지일 수 있음)
    return new NextResponse(text, { status: resp.status });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: "Upstream fetch failed",
        detail: err?.message || String(err),
        target: `${API_BASE}/api/resumes?limit=1000&skip=0`,
      },
      { status: 502 }
    );
  }
}
