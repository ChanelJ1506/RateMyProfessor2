export async function POST(request: Request) {
  try {
    const body = await request.json();

    const flaskRes = await fetch("http://127.0.0.1:8080/api/rate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await flaskRes.json();

    if (!flaskRes.ok) {
      return Response.json(
        { error: data.error || "Flask error" },
        { status: flaskRes.status }
      );
    }

    return Response.json(data);

  } catch (error) {
    console.error("Rate proxy error:", error);
    return Response.json(
      { error: "Could not connect to Flask backend." },
      { status: 503 }
    );
  }
}