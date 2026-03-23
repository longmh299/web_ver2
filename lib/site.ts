// lib/site.ts
export const SITE_URL =
  (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const abs = (path = "/") =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
