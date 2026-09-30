declare global {
  interface Env {
    DB: D1Database;
    GAME_IMAGES: R2Bucket;
  }
}

export {};