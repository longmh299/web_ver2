import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { updatePost } from "@/app/admin/news/actions";
import ImageField from "@/components/ImageField";
import NewsEditor from "@/components/NewsEditor";
import React from "react";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ================= CLIENT INLINE ================= */
function PostEditInline() {
  "use client";

  React.useEffect(() => {
    const $ = (s: string) => document.querySelector(s);

    const title = $('#title') as HTMLInputElement | null;
    const slug = $('#slug') as HTMLInputElement | null;
    const slugHint = $('#slugHint') as HTMLElement | null;

    const mt = $('#metaTitle') as HTMLInputElement | null;
    const md = $('#metaDescription') as HTMLTextAreaElement | null;
    const mtc = $('#metaTitleCount') as HTMLElement | null;
    const mdc = $('#metaDescCount') as HTMLElement | null;

    const tagsInp = $('#tagsInput') as HTMLInputElement | null;
    const tagsWrap = $('#tagsPreview') as HTMLElement | null;

    if (!title || !slug) return;

    const toSlug = (s: string) =>
      s
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');

    let last = slug.value || '';

    /* ===== SLUG ===== */
    const sync = () => {
      const base = toSlug(title.value || '');

      if (slug.value === '' || slug.value === last) {
        slug.value = base;
        last = base;

        if (slugHint) {
          slugHint.textContent = base ? 'Slug gợi ý: ' + base : '';
        }
      }
    };

    title.addEventListener('input', sync);

    /* ===== SEO COUNT ===== */
    const paint = (
      el: HTMLElement,
      val: string,
      min: number,
      max: number
    ) => {
      const len = val.length;
      const ok = len >= min && len <= max;

      el.textContent = `${len} ký tự ${ok ? "(tốt)" : ""}`;
      el.style.color = ok ? "#16a34a" : "#6b7280";
    };

    const tick = () => {
      if (mt && mtc) paint(mtc, mt.value, 50, 60);
      if (md && mdc) paint(mdc, md.value, 140, 160);
    };

    mt?.addEventListener('input', tick);
    md?.addEventListener('input', tick);
    tick();

    /* ===== TAGS ===== */
    const renderTags = () => {
      if (!tagsInp || !tagsWrap) return;

      const tags = (tagsInp.value || "")
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      const unique = [...new Set(tags)];

      tagsWrap.innerHTML = "";

      unique.forEach((t) => {
        const el = document.createElement("span");
        el.className =
          "inline-flex items-center rounded-full border px-2 py-0.5 text-xs";
        el.textContent = t;
        tagsWrap.appendChild(el);
      });
    };

    tagsInp?.addEventListener("input", renderTags);
    renderTags();

    return () => {
      title.removeEventListener("input", sync);
      mt?.removeEventListener("input", tick);
      md?.removeEventListener("input", tick);
      tagsInp?.removeEventListener("input", renderTags);
    };
  }, []);

  return null;
}

/* ================= PAGE ================= */
export default async function EditPostPage({
  params,
}: {
  params: { id: string };
}) {
  const pid = Number(params.id);
  
  if (!Number.isFinite(pid)) {
    return <div>ID không hợp lệ</div>;
  }

  const [post, cats] = await Promise.all([
    prisma.post.findUnique({
      where: { id: pid },
    }),
    prisma.postCategory.findMany(),
  ]);

  if (!post) return <div>Không tìm thấy bài viết</div>;

  return (
    <div className="mx-auto max-w-6xl px-4 space-y-6">
      <h1 className="text-2xl font-semibold">Sửa bài viết</h1>

      <form action={updatePost} className="grid md:grid-cols-3 gap-6">
        <input type="hidden" name="id" value={post.id} />

        {/* LEFT */}
        <section className="md:col-span-2 space-y-6">
          <div className="p-5 border rounded-xl space-y-4">
            <input
              id="title"
              name="title"
              defaultValue={post.title}
              placeholder="Tiêu đề"
              className="w-full border p-2"
            />

            <input
              id="slug"
              name="slug"
              defaultValue={post.slug ?? ""}
              placeholder="slug"
              className="w-full border p-2"
            />
            <p id="slugHint" className="text-xs text-gray-500" />

            <NewsEditor name="content" value={post.content ?? ""} />

            <input
              id="tagsInput"
              name="tags"
              defaultValue={(post.tags || []).join(", ")}
              className="w-full border p-2"
            />
            <div id="tagsPreview" className="flex gap-2 flex-wrap" />
          </div>
        </section>

        {/* RIGHT */}
        <aside className="space-y-4">
          <input
            id="metaTitle"
            name="metaTitle"
            defaultValue={post.metaTitle ?? ""}
            placeholder="Meta title"
            className="w-full border p-2"
          />
          <p id="metaTitleCount" className="text-xs" />

          <textarea
            id="metaDescription"
            name="metaDescription"
            defaultValue={post.metaDescription ?? ""}
            className="w-full border p-2"
          />
          <p id="metaDescCount" className="text-xs" />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            Lưu
          </button>
        </aside>
      </form>

      {/* 🔥 INLINE CLIENT */}
      <PostEditInline />
    </div>
  );
}