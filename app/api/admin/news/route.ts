// app/api/admin/news/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// helpers
const slugify = (input: string) =>
  input
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 96);

const toBoolUndef = (v: unknown) =>
  v === undefined ? undefined :
  (typeof v === "boolean" ? v : String(v).trim() === "true" || v === 1 || v === "1");

const toTagsUndef = (v: unknown) => {
  if (v === undefined) return undefined;
  if (Array.isArray(v)) return v.map(String).map(s => s.trim()).filter(Boolean);
  if (typeof v === "string") return v.split(",").map(s => s.trim()).filter(Boolean);
  return [];
};

// PUT /api/admin/news/:id
export async function PUT(req: Request, context: any) {
  try {
    const id = Number(context?.params?.id);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ ok: false, message: "Invalid id" }, { status: 400 });
    }

    const old = await prisma.post.findUnique({ where: { id }, select: { slug: true } });
    if (!old) return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });

    const body = await req.json().catch(() => ({} as any));

    const updated = await prisma.post.update({
      where: { id },
      data: {
        title: body.title ?? undefined,
        slug: body.slug ? slugify(String(body.slug)) : undefined,
        excerpt: body.excerpt ?? undefined,
        content: body.content ?? undefined,
        coverImage: body.coverImage ?? undefined,
        tags: toTagsUndef(body.tags),
        published: toBoolUndef(body.published),
        categoryId: body.categoryId ?? undefined,

        metaTitle: body.metaTitle ?? undefined,
        metaDescription: body.metaDescription ?? undefined,
        canonicalUrl: body.canonicalUrl ?? undefined,
        ogImage: body.ogImage ?? undefined,
        noindex: toBoolUndef(body.noindex),
        nofollow: toBoolUndef(body.nofollow),
      },
      select: { id: true, slug: true },
    });

    if (old.slug !== updated.slug) {
      try {
        await prisma.slugRedirect.create({
          data: { entityType: "post", fromSlug: old.slug, toSlug: updated.slug },
        });
      } catch { /* ignore if table/unique not available */ }
    }

    return NextResponse.json({ ok: true, post: updated });
  } catch (e) {
    return NextResponse.json({ ok: false, message: "Internal error" }, { status: 500 });
  }
}

// DELETE /api/admin/news/:id
export async function DELETE(_req: Request, context: any) {
  try {
    const id = Number(context?.params?.id);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ ok: false, message: "Invalid id" }, { status: 400 });
    }

    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, message: "Internal error" }, { status: 500 });
  }
}
