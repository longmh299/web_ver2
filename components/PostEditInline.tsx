// components/PostEditInline.tsx

"use client";

import { useEffect } from "react";

export default function PostEditInline() {
  useEffect(() => {
    const $ = (s: string) => document.querySelector(s);

    const title = $("#title") as HTMLInputElement | null;
    const slug = $("#slug") as HTMLInputElement | null;
    const slugHint = $("#slugHint") as HTMLElement | null;

    const mt = $("#metaTitle") as HTMLInputElement | null;
    const md = $("#metaDescription") as HTMLTextAreaElement | null;
    const mtc = $("#metaTitleCount") as HTMLElement | null;
    const mdc = $("#metaDescCount") as HTMLElement | null;

    const tagsInp = $("#tagsInput") as HTMLInputElement | null;
    const tagsWrap = $("#tagsPreview") as HTMLElement | null;

    if (!title || !slug) return;

    const toSlug = (s: string) =>
      s
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");

    let last = slug.value || "";

    /* ===== SLUG ===== */
    const sync = () => {
      const base = toSlug(title.value || "");

      if (slug.value === "" || slug.value === last) {
        slug.value = base;
        last = base;

        if (slugHint) {
          slugHint.textContent = base ? `Slug gợi ý: ${base}` : "";
        }
      }
    };

    title.addEventListener("input", sync);

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

    mt?.addEventListener("input", tick);
    md?.addEventListener("input", tick);
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