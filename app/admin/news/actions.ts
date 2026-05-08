import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import sanitizeHtml from "sanitize-html";

/* ================= HELPERS ================= */

function toSlug(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 160);
}

function parseTags(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return [...new Set(raw.split(",").map(t => t.trim().toLowerCase()).filter(Boolean))].slice(0, 30);
}

function cleanContent(html: string) {
  return sanitizeHtml(html, {
    allowedTags: ["p","h2","h3","ul","ol","li","strong","em","a","img","blockquote","div"],
    allowedAttributes: {
      a: ["href"],
      img: ["src", "alt"],
      div: ["class"],
    },
  });
}

function getBool(fd: FormData, key: string) {
  return fd.getAll(key).map(String).pop() === "1";
}

/* ================= CREATE ================= */

export async function createPost(fd: FormData) {
  "use server";

  const title = String(fd.get("title") ?? "").trim();
  if (!title) throw new Error("Thiếu tiêu đề");

  let slug = String(fd.get("slug") ?? "").trim();
  slug = slug ? toSlug(slug) : toSlug(title);

  const content = cleanContent(String(fd.get("content") ?? ""));
  const plainText = content.replace(/<[^>]+>/g, "").slice(0, 160);

  const metaTitle =
    String(fd.get("metaTitle") ?? "").trim() || title.slice(0, 60);

  const metaDescription =
    String(fd.get("metaDescription") ?? "").trim() || plainText;

  try {
    let finalSlug = slug;
    let i = 1;

    while (await prisma.post.findFirst({ where: { slug: finalSlug } })) {
      finalSlug = `${slug}-${i++}`;
    }

    const post = await prisma.post.create({
      data: {
        title,
        slug: finalSlug,
        excerpt: String(fd.get("excerpt") ?? "").trim() || null,
        content,
        coverImage: String(fd.get("coverImage") ?? "").trim() || null,
        tags: parseTags(String(fd.get("tags"))),
        published: getBool(fd, "published"),
        categoryId: fd.get("categoryId") ? Number(fd.get("categoryId")) : null,
        metaTitle,
        metaDescription,
      },
    });

    revalidatePath("/admin/news");
    revalidatePath(`/tin-tuc/${post.slug}`);
    redirect("/admin/news?ok=1");

  } catch (e: any) {
    redirect(`/admin/news?err=${encodeURIComponent(e.message)}`);
  }
}

/* ================= UPDATE ================= */

export async function updatePost(fd: FormData) {
  "use server";

  const id = Number(fd.get("id"));
  if (!Number.isFinite(id)) throw new Error("ID không hợp lệ");

  const title = String(fd.get("title") ?? "").trim();
  if (!title) throw new Error("Thiếu tiêu đề");

  let slug = String(fd.get("slug") ?? "").trim();
  slug = slug ? toSlug(slug) : toSlug(title);

  const content = cleanContent(String(fd.get("content") ?? ""));

  try {
    let finalSlug = slug;
    let i = 1;

    while (
      await prisma.post.findFirst({
        where: { slug: finalSlug, NOT: { id } },
      })
    ) {
      finalSlug = `${slug}-${i++}`;
    }

    await prisma.post.update({
      where: { id },
      data: {
        title,
        slug: finalSlug,
        content,
        tags: parseTags(String(fd.get("tags"))),
      },
    });

    revalidatePath("/admin/news");
    redirect("/admin/news?ok=1");

  } catch (e: any) {
    redirect(`/admin/news?err=${encodeURIComponent(e.message)}`);
  }
}

/* ================= DELETE ================= */

export async function deletePost(fd: FormData) {
  "use server"; // 🔥 CÁI QUAN TRỌNG NHẤT

  const id = Number(fd.get("id"));
  if (!Number.isFinite(id)) throw new Error("ID không hợp lệ");

  try {
    await prisma.post.delete({ where: { id } });

    revalidatePath("/admin/news");
    redirect("/admin/news?ok=1");

  } catch (e: any) {
    redirect(`/admin/news?err=${encodeURIComponent(e.message)}`);
  }
}