export async function GET() {
  try {
    const res = await fetch("http://127.0.0.1:8080/api/metrics");
    if (!res.ok) {
      return Response.json({ error: "Backend error" }, { status: res.status });
    }
    return Response.json(await res.json());
  } catch {
    return Response.json({ error: "Could not connect to backend." }, { status: 503 });
  }
}