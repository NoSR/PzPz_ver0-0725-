type HealthContext = {
  env: Env;
};

export const onRequestGet = async ({ env }: HealthContext): Promise<Response> => {
  try {
    const result = await env.DB.prepare('SELECT 1 AS ok').first<{ ok: number }>();

    if (result?.ok !== 1) {
      return Response.json(
        { status: 'degraded', database: 'unavailable' },
        { status: 503, headers: { 'Cache-Control': 'no-store' } },
      );
    }

    return Response.json(
      { status: 'ok', database: 'reachable' },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch {
    return Response.json(
      { status: 'degraded', database: 'unavailable' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }
};