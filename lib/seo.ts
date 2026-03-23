// src/lib/seo.ts
import type { Metadata } from 'next';
import { site } from '@/site';

export type SEOFields = {
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  ogImage?: string | null;
  noindex?: boolean | null;
  nofollow?: boolean | null;
};

export function canonicalFor(path: string, canonicalUrl?: string | null) {
  if (canonicalUrl && /^https?:\/\//.test(canonicalUrl)) return canonicalUrl;
  const base = site.url.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return canonicalUrl ? canonicalUrl : `${base}${p}`;
}

export function robotsFrom(flags?: { noindex?: boolean | null; nofollow?: boolean | null }) {
  const index = !flags?.noindex;
  const follow = !flags?.nofollow;
  return {
    index,
    follow,
    nocache: false,
    googleBot: {
      index,
      follow,
      'max-video-preview': -1 as const,
      'max-image-preview': 'large' as const,
      'max-snippet': -1 as const,
    },
  };
}

export function buildMetadataFromSEO(
  seo: SEOFields,
  path: string,
  fallback: { title: string; description?: string; image?: string }
): Metadata {
  const title = seo.metaTitle || fallback.title;
  const description = seo.metaDescription || fallback.description || '';
  const canonical = canonicalFor(path, seo.canonicalUrl);
  const image = seo.ogImage || fallback.image || `${site.url}/og-default.jpg`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      url: canonical,
      siteName: site.name,
      title,
      description,
      images: [{ url: image }],
    },
    robots: robotsFrom({ noindex: seo.noindex, nofollow: seo.nofollow }),
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}
