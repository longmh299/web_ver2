"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/* helpers */
function toSlug(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
function parseTags(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 30);
}

/* CREATE: giữ nguyên — sau khi tạo xong chuyển sang trang sửa */
export async function createPost(fd: FormData) {
  const title = String(fd.get("title") ?? "").trim();
  if (!title) throw new Error("Thiếu tiêu đề");

  const slug = (String(fd.get("slug") ?? "").trim() || toSlug(title)).slice(0, 160);

  const post = await prisma.post.create({
    data: {
      title,
      slug,
      excerpt: String(fd.get("excerpt") ?? "").trim() || null,
      content: String(fd.get("content") ?? "") || null,
      coverImage: String(fd.get("coverImage") ?? "").trim() || null,
      tags: parseTags(String(fd.get("tags"))),
      published: fd.getAll("published").map(String).pop() === "1",
      categoryId: fd.get("categoryId") ? Number(fd.get("categoryId")) : null,
      metaTitle: String(fd.get("metaTitle") ?? "").trim() || null,
      metaDescription: String(fd.get("metaDescription") ?? "").trim() || null,
      canonicalUrl: String(fd.get("canonicalUrl") ?? "").trim() || null,
      ogImage: String(fd.get("ogImage") ?? "").trim() || null,
      noindex: fd.getAll("noindex").map(String).pop() === "1",
      nofollow: fd.getAll("nofollow").map(String).pop() === "1",
    },
  });

  revalidatePath("/admin/news");
  revalidatePath(`/tin-tuc/${post.slug}`, "page");
  redirect(`/admin/news`);
}

/* UPDATE: redirect thành công nằm NGOÀI try/catch */
export async function updatePost(fd: FormData) {
  const id = Number(fd.get("id"));
  if (!Number.isFinite(id)) throw new Error("ID không hợp lệ");

  const title = String(fd.get("title") ?? "").trim();
  if (!title) throw new Error("Thiếu tiêu đề");

  const slug = (String(fd.get("slug") ?? "").trim() || toSlug(title)).slice(0, 160);

  try {
    await prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt: String(fd.get("excerpt") ?? "").trim() || null,
        content: String(fd.get("content") ?? "") || null,
        coverImage: String(fd.get("coverImage") ?? "").trim() || null,
        tags: parseTags(String(fd.get("tags"))),
        published: fd.getAll("published").map(String).pop() === "1",
        categoryId: fd.get("categoryId") ? Number(fd.get("categoryId")) : null,
        metaTitle: String(fd.get("metaTitle") ?? "").trim() || null,
        metaDescription: String(fd.get("metaDescription") ?? "").trim() || null,
        canonicalUrl: String(fd.get("canonicalUrl") ?? "").trim() || null,
        ogImage: String(fd.get("ogImage") ?? "").trim() || null,
        noindex: fd.getAll("noindex").map(String).pop() === "1",
        nofollow: fd.getAll("nofollow").map(String).pop() === "1",
      },
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Lỗi không xác định";
    redirect(`/admin/news?err=${encodeURIComponent(msg)}`); // chỉ chạy khi thật sự lỗi
  }

  revalidatePath("/admin/news");
  redirect("/admin/news?ok=1"); // thành công → flash “ok”
}

/* DELETE: có thể giữ nguyên; thêm try/catch nếu muốn flash lỗi riêng */
export async function deletePost(fd: FormData) {
  const id = Number(fd.get("id"));
  if (!Number.isFinite(id)) throw new Error("ID không hợp lệ");

  try {
    const deleted = await prisma.post.delete({
      where: { id },
      select: { slug: true },
    });
    revalidatePath("/admin/news");
    if (deleted?.slug) revalidatePath(`/tin-tuc/${deleted.slug}`, "page");
    redirect("/admin/news?ok=1");
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Lỗi không xác định";
    redirect(`/admin/news?err=${encodeURIComponent(msg)}`);
  }
}
