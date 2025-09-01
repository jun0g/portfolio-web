// app/resumes/page.tsx
export const dynamic = "force-dynamic";

async function fetchFromNextApi() {
  const origin = process.env.SITE_ORIGIN ?? "http://localhost:3000";
  const res = await fetch(`${origin}/api/resumes`, { cache: "no-store" });

  const ct = res.headers.get("content-type") || "";
  const payload = ct.includes("application/json")
    ? await res.json()
    : await res.text();

  return { ok: res.ok, status: res.status, payload };
}

export default async function ResumesPage() {
  const { ok, status, payload } = await fetchFromNextApi();

  return (
    <main style={{ maxWidth: 960, margin: "40px auto", padding: 16 }}>
      <h1>/api/resumes 응답(원본 그대로)</h1>

      {!ok && (
        <p style={{ color: "#dc2626" }}>
          요청 실패: status {status}
        </p>
      )}

      <pre
        style={{
          background: "#0f172a",
          color: "#e2e8f0",
          padding: 16,
          borderRadius: 8,
          overflowX: "auto",
        }}
      >
        {typeof payload === "string"
          ? payload
          : JSON.stringify(payload, null, 2)}
      </pre>
    </main>
  );
}
