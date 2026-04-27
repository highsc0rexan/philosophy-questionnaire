interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const row = await env.DB.prepare(
    `SELECT
       COUNT(*) AS n,
       AVG(T) AS T, AVG(S) AS S, AVG(C) AS C, AVG(E) AS E, AVG(ON_) AS ON_,
       AVG(U) AS U, AVG(SK) AS SK, AVG(VT) AS VT, AVG(CO) AS CO,
       AVG(A) AS A, AVG(EP) AS EP, AVG(D) AS D, AVG(B) AS B
     FROM submissions`,
  ).first<{
    n: number;
    T: number | null; S: number | null; C: number | null; E: number | null;
    ON_: number | null; U: number | null; SK: number | null; VT: number | null;
    CO: number | null; A: number | null; EP: number | null; D: number | null;
    B: number | null;
  }>();

  const n = row?.n ?? 0;
  const averages =
    n === 0
      ? null
      : {
          T: row!.T ?? 0,
          S: row!.S ?? 0,
          C: row!.C ?? 0,
          E: row!.E ?? 0,
          ON: row!.ON_ ?? 0,
          U: row!.U ?? 0,
          SK: row!.SK ?? 0,
          VT: row!.VT ?? 0,
          CO: row!.CO ?? 0,
          A: row!.A ?? 0,
          EP: row!.EP ?? 0,
          D: row!.D ?? 0,
          B: row!.B ?? 0,
        };

  return new Response(JSON.stringify({ count: n, averages }), {
    headers: {
      "content-type": "application/json",
      "cache-control": "public, max-age=30",
    },
  });
};
