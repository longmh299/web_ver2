// components/SlugField.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { slugify } from '@/lib/slug';

export default function SlugField({
  entity,
  titleName,
  slugName = 'slug',
  defaultTitle = '',
  defaultSlug = '',
  excludeId,
}: {
  entity: 'product' | 'post' | 'category' | 'postCategory';
  titleName: string;      // name của input title, ví dụ "name" hoặc "title"
  slugName?: string;      // name của input slug
  defaultTitle?: string;
  defaultSlug?: string;
  excludeId?: string;
}) {
  const [title, setTitle] = useState(defaultTitle);
  const [slug, setSlug] = useState(defaultSlug);
  const [touched, setTouched] = useState(!!defaultSlug);
  const [checking, setChecking] = useState(false);
  const [unique, setUnique] = useState(true);

  // auto-gen khi chưa sửa slug thủ công
  useEffect(() => {
    if (!touched) setSlug(slugify(title));
  }, [title, touched]);

  // debounce check unique với AbortController
  useEffect(() => {
    if (!slug) return;
    const controller = new AbortController();
    const { signal } = controller;
    setChecking(true);

    const t = setTimeout(async () => {
      try {
        const q = new URLSearchParams({ entity, slug });
        if (excludeId) q.set('excludeId', excludeId);

        const res = await fetch(`/api/slug-unique?${q.toString()}`, {
          method: 'GET',
          cache: 'no-store',
          signal,
        });

        if (signal.aborted) return;

        if (!res.ok) {
          setUnique(true);
          return;
        }

        const ct = res.headers.get('content-type') || '';
        if (!ct.includes('application/json')) {
          setUnique(true);
          return;
        }

        const json: any = await res.json();
        setUnique(Boolean(json?.unique));
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          setUnique(true);
        }
      } finally {
        if (!signal.aborted) setChecking(false);
      }
    }, 300);

    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [slug, entity, excludeId]);

  const hint = useMemo(() => {
    if (!slug) return 'Chưa có slug';
    if (checking) return 'Đang kiểm tra…';
    return unique ? 'Slug hợp lệ' : 'Slug đã tồn tại';
  }, [slug, checking, unique]);

  return (
    <div className="space-y-2">
      <label className="font-medium">Tiêu đề & Slug</label>
      <input
        name={titleName}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Tiêu đề…"
        className="w-full border rounded px-2 py-1"
      />
      <div className="flex gap-2 items-center">
        <input
          name={slugName}
          value={slug}
          onChange={(e) => {
            setSlug(slugify(e.target.value));
            setTouched(true);
          }}
          placeholder="auto từ tiêu đề"
          className="flex-1 border rounded px-2 py-1"
        />
        <span
          className={`text-sm ${unique ? 'text-green-600' : 'text-red-600'}`}
        >
          {hint}
        </span>
      </div>
    </div>
  );
}
