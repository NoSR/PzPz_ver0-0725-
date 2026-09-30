import { getAuthenticatedAdmin } from '../../lib/adminSession';
import { json } from '../../lib/booking';

type FunctionContext = { request: Request; env: Env };

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

const getImageExtension = (bytes: Uint8Array, contentType: string): string | null => {
  if (contentType === 'image/jpeg' && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'jpg';
  if (contentType === 'image/png'
    && bytes.subarray(0, 8).join(',') === '137,80,78,71,13,10,26,10') return 'png';
  if (contentType === 'image/webp'
    && String.fromCharCode(...bytes.subarray(0, 4)) === 'RIFF'
    && String.fromCharCode(...bytes.subarray(8, 12)) === 'WEBP') return 'webp';
  return null;
};

export const onRequestPost = async ({ request, env }: FunctionContext): Promise<Response> => {
  const admin = await getAuthenticatedAdmin(request, env);
  if (!admin) return json({ error: 'Unauthorized.' }, 401);

  const requestSize = Number(request.headers.get('content-length'));
  if (Number.isFinite(requestSize) && requestSize > MAX_IMAGE_BYTES + 64 * 1024) {
    return json({ error: '이미지 파일은 8MB 이하여야 합니다.' }, 413);
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return json({ error: '이미지 업로드 요청을 읽을 수 없습니다.' }, 400);
  }

  const image = formData.get('image');
  if (!(image instanceof File) || image.size === 0) {
    return json({ error: '업로드할 이미지 파일을 선택해 주세요.' }, 400);
  }
  if (image.size > MAX_IMAGE_BYTES) {
    return json({ error: '이미지 파일은 8MB 이하여야 합니다.' }, 413);
  }

  const data = await image.arrayBuffer();
  const extension = getImageExtension(new Uint8Array(data), image.type.toLowerCase());
  if (!extension) {
    return json({ error: 'JPEG, PNG, WebP 이미지 파일만 업로드할 수 있습니다.' }, 415);
  }

  const key = `${crypto.randomUUID()}.${extension}`;
  await env.GAME_IMAGES.put(key, data, {
    httpMetadata: {
      contentType: image.type.toLowerCase(),
      cacheControl: 'public, max-age=31536000, immutable',
    },
  });

  await env.DB.prepare(
    `INSERT INTO admin_audit_logs (id, admin_id, action, target_type, target_id, change_summary)
     VALUES (?, ?, 'game.image_uploaded', 'game_image', ?, 'Game image uploaded')`,
  ).bind(crypto.randomUUID(), admin.id, key).run();

  return json({ imageUrl: `/api/public/game-images/${key}` }, 201);
};