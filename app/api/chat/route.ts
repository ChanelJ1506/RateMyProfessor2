export async function POST(request: Request) {
  try {
    const body = await request.json();

    const flaskRes = await fetch("http://127.0.0.1:8080/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...body,
        use_mmr:    body.use_mmr    ?? true,
        use_rerank: body.use_rerank ?? true,
      }),
    });

    if (!flaskRes.ok) {
      const err = await flaskRes.text();
      return Response.json(
        { error: `Backend error: ${err}` },
        { status: flaskRes.status }
      );
    }

    return new Response(flaskRes.body, {
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    console.error("Chat proxy error:", error);
    return Response.json(
      { error: "Could not connect to backend. Make sure setup_rag.py is running." },
      { status: 503 }
    );
  }
}