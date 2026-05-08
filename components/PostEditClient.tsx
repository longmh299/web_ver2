"use client";

import { useEffect } from "react";

export default function PostEditClient() {
  useEffect(() => {
    const $ = (s: string) => document.querySelector(s);

    const title = $('#title') as HTMLInputElement;
    const slug = $('#slug') as HTMLInputElement;

    const toSlug = (s: string) =>
      s
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');

    let last = slug?.value || '';

    function sync() {
      if (!title || !slug) return;
      const base = toSlug(title.value || '');

      if (slug.value === '' || slug.value === last) {
        slug.value = base;
        last = base;
      }
    }

    title?.addEventListener('input', sync);

    return () => {
      title?.removeEventListener('input', sync);
    };
  }, []);

  return null;
}