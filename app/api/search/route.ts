export async function POST(request: Request) {
  try {
    const body = await request.json();
    const res = await fetch("http://127.0.0.1:8080/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...body,
        use_rerank: body.use_rerank ?? true,
        use_mmr:    body.use_mmr    ?? false,
      }),
    });
    const data = await res.json();
    if (!res.ok) return Response.json({ error: data.detail || "Search error" }, { status: res.status });
    return Response.json(data);
  } catch (error) {
    console.error("Search proxy error:", error);
    return Response.json({ error: "Could not connect to backend." }, { status: 503 });
  }
}