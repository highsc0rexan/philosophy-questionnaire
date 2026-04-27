interface Env {
  DB: D1Database;
}

const KEYS = ["T", "S", "C", "E", "ON", "U", "SK", "VT", "CO", "A", "EP", "D", "B"] as const;

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const scores = body.scores as Record<string, unknown> | undefined;
  if (!scores || typeof scores !== "object") {
    return new Response("Missing scores", { status: 400 });
  }

  const values: number[] = [];
  for (const k of KEYS) {
    const v = scores[k];
    if (typeof v !== "number" || !Number.isFinite(v) || v < -100 || v > 100) {
      return new Response(`Invalid value for ${k}`, { status: 400 });
    }
    values.push(v);
  }

  await env.DB.prepare(
    `INSERT INTO submissions (T, S, C, E, ON_, U, SK, VT, CO, A, EP, D, B)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(...values)
    .run();

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "content-type": "application/json" },
  });
};
