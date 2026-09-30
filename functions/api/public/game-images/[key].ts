type FunctionContext = {
  request: Request;
  env: Env;
  params: { key?: string };
};

export const onRequestGet = async ({ env, params }: FunctionContext): Promise<Response> => {
  const key = params.key ?? '';
  if (!/^[0-9a-f-]{36}\.(jpg|png|webp)$/.test(key)) {
    return new Response('Not found.', { status: 404 });
  }

  const image = await env.GAME_IMAGES.get(key);
  if (!image) return new Response('Not found.', { status: 404 });

  const headers = new Headers();
  image.writeHttpMetadata(headers);
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('ETag', image.httpEtag);

  return new Response(image.body, { headers });
};