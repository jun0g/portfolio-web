// app/api/resumes/[...slug]/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const API_BASE = process.env.API_BASE_URL ?? "http://localhost:8043";

// Safely build URL: keep protocol slashes and avoid double-slash collapse
function buildUpstream(base: string, path: string) {
  const b = base.replace(/\/+$/, "");
  const p = path.replace(/^\/+/, "");
  return `${b}/${p}`;
}

function resolvePath(slug: string[] | undefined) {
  if (!slug || slug.length === 0) return "/api/resumes";
  if (slug.length === 1) return `/api/resumes/${encodeURIComponent(slug[0])}`;
  return `/api/resumes/${slug.map(encodeURIComponent).join("/")}`;
}

async function handler(req: Request, method: string, slug?: string[]) {
  const upstream = buildUpstream(API_BASE, resolvePath(slug));
  const init: RequestInit = {
    method,
    headers: {
      "content-type": req.headers.get("content-type") ?? "",
      authorization: req.headers.get("authorization") ?? "",
    },
    body: ["GET", "HEAD"].includes(method) ? undefined : await req.text(),
    cache: "no-store",
  };
  try {
    const resp = await fetch(upstream, init);
    const body = await resp.text();
    return new NextResponse(body, { status: resp.status, headers: resp.headers });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: "Upstream fetch failed",
        target: upstream,
        detail: err?.message ?? String(err),
      },
      { status: 502 }
    );
  }
}

export async function GET(req: Request, context: any) {
  const slug = context?.params?.slug as string[] | undefined;
  return handler(req, "GET", slug);
}
export async function POST(req: Request, context: any) {
  const slug = context?.params?.slug as string[] | undefined;
  return handler(req, "POST", slug);
}
export async function PUT(req: Request, context: any) {
  const slug = context?.params?.slug as string[] | undefined;
  return handler(req, "PUT", slug);
}
export async function PATCH(req: Request, context: any) {
  const slug = context?.params?.slug as string[] | undefined;
  return handler(req, "PATCH", slug);
}
export async function DELETE(req: Request, context: any) {
  const slug = context?.params?.slug as string[] | undefined;
  return handler(req, "DELETE", slug);
}