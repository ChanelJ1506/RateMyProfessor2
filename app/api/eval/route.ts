export async function POST(request: Request) {
  try {
    const body = await request.json();
    const res = await fetch("http://127.0.0.1:8080/api/eval", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) return Response.json({ error: data.detail || "Eval error" }, { status: res.status });
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: "Could not connect to backend." }, { status: 503 });
  }
}