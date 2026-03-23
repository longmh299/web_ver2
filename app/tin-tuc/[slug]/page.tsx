// app/tin-tuc/[slug]/page.tsx
import ContentRenderer from '@/components/news/ContentRenderer';
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { decode } from "he";

export const dynamic = 'force-dynamic';

type Params = { slug?: string };

/* ================= UTIL ================= */

function fmtDate(d: Date) {
  try {
    return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' }).format(d);
  } catch {
    return d.toISOString().slice(0, 10);
  }
}

async function getPost(slug: string | undefined) {
  if (!slug) return null;

  return prisma.post.findUnique({
    where: { slug: String(slug) },
    include: {
      category: { select: { id: true, name: true, slug: true } },
    },
  });
}

function decodeHtml(str: string) {
  return decode(str);
}

function extractHeadings(html: string) {
  const matches = [...html.matchAll(/<h2.*?>(.*?)<\/h2>/gi)];

  return matches.map((m, i) => ({
    id: `h-${i}`,
    text: decodeHtml(m[1].replace(/<[^>]+>/g, "")),
  }));
}

function normalizeContentHeadings(html: string) {
  return html
    .replace(/<h1(\s|>)/gi, '<h2$1')
    .replace(/<\/h1>/gi, '</h2>');
}

function injectHeadingIds(html: string) {
  let i = 0;
  return html.replace(/<h2(.*?)>/gi, () => {
    return `<h2 id="h-${i++}"$1>`;
  });
}

/* ================= SEO ================= */

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) return {};

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt || undefined,
  };
}

/* ================= PAGE ================= */

export default async function NewsDetailPage(
  { params }: { params: Promise<Params> }
) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post || !post.published) notFound();

  let content = post.content || '';

  content = normalizeContentHeadings(content);
  const headings = extractHeadings(content);
  content = injectHeadingIds(content);

  const related = await prisma.post.findMany({
    where: {
      published: true,
      categoryId: post.categoryId,
      id: { not: post.id },
    },
    take: 6,
  });

  return (
    <div className="bg-[var(--color-bg)] text-slate-800">

      {/* HERO */}
      <div className="border-b bg-white">
        <div className="max-w-3xl mx-auto px-4 py-10">

          <div className="text-sm text-gray-500 mb-4">
            <Link href="/">Trang chủ</Link> / <Link href="/tin-tuc">Tin tức</Link>
          </div>

          <h1 className="text-3xl md:text-4xl font-semibold mb-4">
            {post.title}
          </h1>

          <div className="text-sm text-gray-500 mb-6">
            {fmtDate(post.createdAt as any)}
          </div>

        </div>
      </div>

      {/* BODY */}
      <div className="max-w-6xl mx-auto px-4 py-10 grid lg:grid-cols-[1fr_280px] gap-12">

        {/* MAIN */}
        <div>

          {/* COVER */}
          {post.coverImage && (
            <div className="mb-10 max-w-4xl mx-auto rounded-2xl overflow-hidden">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full object-cover"
              />
            </div>
          )}

          {/* CTA giữa bài (fix flow) */}
          <div className="my-10 max-w-3xl mx-auto p-6 rounded-xl bg-slate-900 text-white">
            <p className="font-medium text-lg mb-2">
              Cần tư vấn máy phù hợp?
            </p>
            <p className="text-sm text-gray-300 mb-4">
              Đội ngũ kỹ thuật sẽ hỗ trợ bạn miễn phí
            </p>

            <Link
              href="/lien-he"
              className="inline-block bg-white text-slate-900 px-4 py-2 rounded-lg text-sm font-medium"
            >
              Nhận báo giá
            </Link>
          </div>

          {/* CONTENT (FIX CORE UI) */}
          <article
            className="
              prose prose-lg max-w-3xl mx-auto prose-slate
              prose-headings:font-semibold
              prose-h2:mt-10 prose-h2:mb-4
              prose-p:leading-relaxed
              prose-img:rounded-xl prose-img:shadow-sm
              prose-img:max-w-3xl prose-img:mx-auto
              prose-table:w-full prose-table:border
              prose-th:border prose-td:border
              prose-th:bg-gray-100 prose-th:p-2 prose-td:p-2
            "
          >
            <ContentRenderer html={content} />
          </article>

          {/* CTA cuối */}
          <div className="mt-12 max-w-3xl mx-auto p-6 border rounded-xl text-center">
            <h3 className="font-semibold mb-2">
              Bạn cần chọn đúng loại máy?
            </h3>

            <Link
              href="/lien-he"
              className="bg-[var(--color-accent)] text-white px-6 py-3 rounded-lg text-sm"
            >
              Nhận tư vấn ngay
            </Link>
          </div>

          {/* RELATED */}
          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="text-xl font-semibold mb-6">
                Bài viết liên quan
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                {related.map((r) => (
                  <Link key={r.id} href={`/tin-tuc/${r.slug}`}>
                    <div className="border rounded-xl overflow-hidden hover:shadow-md transition">

                      {r.coverImage && (
                        <img
                          src={r.coverImage}
                          className="w-full h-40 object-cover"
                        />
                      )}

                      <div className="p-4 text-sm font-medium line-clamp-2">
                        {r.title}
                      </div>

                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* SIDEBAR */}
        {headings.length > 0 && (
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-6">

              <div className="border rounded-xl p-4 bg-white">
                <div className="font-semibold mb-3 text-sm">
                  Mục lục
                </div>

                <ul className="space-y-2 text-sm">
                  {headings.map((h) => (
                    <li key={h.id}>
                      <a
                        href={`#${h.id}`}
                        className="text-gray-600 hover:text-[var(--color-accent)]"
                      >
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}