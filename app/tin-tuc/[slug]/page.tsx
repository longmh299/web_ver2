import ContentRenderer from '@/components/news/ContentRenderer';
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { decode } from 'he';

export const revalidate = 60;

type Params = { slug?: string };

/* ================= UTIL ================= */

function fmtDate(d: Date) {
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
  }).format(d);
}

function readingTime(html: string) {
  const text = html.replace(/<[^>]+>/g, '');
  return Math.max(1, Math.ceil(text.length / 1000));
}

function decodeHtml(str: string) {
  return decode(str);
}

function extractHeadings(html: string) {
  const matches = [...html.matchAll(/<h2.*?>(.*?)<\/h2>/gi)];

  return matches.map((m, i) => ({
    id: `h-${i}`,
    text: decodeHtml(m[1].replace(/<[^>]+>/g, '')),
  }));
}

function normalizeContent(html: string) {
  return html
    .replace(/<h1(\s|>)/gi, '<h2$1')
    .replace(/<\/h1>/gi, '</h2>')
    .replace(/<h4(\s|>)/gi, '<h3$1')
    .replace(/<\/h4>/gi, '</h3>');
   
}

function injectHeadingIds(html: string) {
  let i = 0;
  return html.replace(/<h2(.*?)>/gi, () => {
    return `<h2 id="h-${i++}">`;
  });
}

/* ================= DATA ================= */

async function getPost(slug?: string) {
  if (!slug) return null;

  return prisma.post.findUnique({
    where: { slug },
    include: { category: true },
  });
}

async function getRelated(postId: number, categoryId?: number | null) {
  return prisma.post.findMany({
    where: {
      published: true,
      ...(categoryId && { categoryId }),
      id: { not: postId },
    },
    take: 6,
  });
}

/* ================= SEO ================= */

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) return {};

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt || '',
    openGraph: {
      title: post.title,
      description: post.excerpt || '',
      images: post.ogImage || post.coverImage || undefined,
    },
  };
}

/* ================= PAGE ================= */

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;

  const post = await getPost(slug);
  if (!post || !post.published) notFound();

  let content = post.content || '';

  // 🔥 FIX QUAN TRỌNG
  content = decode(content); // fix encode
  content = normalizeContent(content);

  const headings = extractHeadings(content);
  content = injectHeadingIds(content);

  const related = await getRelated(post.id, post.categoryId);

  return (
    <div className="bg-[var(--color-bg)] text-slate-800">

      {/* ================= HERO ================= */}
      <div className="relative w-full h-[320px] md:h-[420px] overflow-hidden">
        {post.coverImage && (
          <img
            src={post.coverImage}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative max-w-6xl mx-auto px-4 h-full flex flex-col justify-center text-white">
          <div className="text-sm mb-3 opacity-80">
            <Link href="/">Trang chủ</Link> /{' '}
            <Link href="/tin-tuc">Tin tức</Link> / {post.category?.name}
          </div>

          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
            {post.title}
          </h1>

          <div className="text-sm opacity-80">
            {fmtDate(post.createdAt)} • {readingTime(content)} phút đọc
          </div>
        </div>
      </div>

      {/* ================= BODY ================= */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid lg:grid-cols-[1fr_320px] gap-12">

        {/* MAIN */}
        <div>

          {/* SUMMARY */}
          {post.excerpt && (
            <div className="mb-8 p-5 bg-blue-50 border rounded-xl text-sm">
              <strong>Tóm tắt nhanh:</strong> {post.excerpt}
            </div>
          )}

          {/* CONTENT */}
          <article className="max-w-none">
            <ContentRenderer html={content} />
          </article>

          {/* CTA */}
          <div className="mt-16 bg-[var(--color-accent)] text-white rounded-2xl p-8 text-center">
            <h3 className="text-xl font-semibold mb-3">
              Cần tư vấn giải pháp phù hợp?
            </h3>

            <Link
              href="/lien-he"
              className="bg-white text-black px-6 py-3 rounded-lg inline-block"
            >
              Liên hệ ngay
            </Link>
          </div>

          {/* RELATED */}
          {related.length > 0 && (
            <div className="mt-20">
              <h2 className="text-2xl font-semibold mb-6">
                Bài viết liên quan
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                {related.map((r) => (
                  <Link key={r.id} href={`/tin-tuc/${r.slug}`}>
                    <div className="group border rounded-2xl overflow-hidden hover:shadow-lg transition bg-white">

                      <div className="overflow-hidden">
                        <img
                          src={r.coverImage || ''}
                          className="w-full h-48 object-cover group-hover:scale-105 transition"
                        />
                      </div>

                      <div className="p-4">
                        <div className="text-xs text-gray-400 mb-2">
                          {fmtDate(r.createdAt)}
                        </div>

                        <div className="font-semibold line-clamp-2 group-hover:text-[var(--color-accent)]">
                          {r.title}
                        </div>
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
            <div className="sticky top-24">

              <div className="border rounded-2xl p-5 bg-white shadow-sm">
                <div className="font-semibold mb-4">
                  📑 Mục lục
                </div>

                <ul className="space-y-3 text-sm">
                  {headings.map((h) => (
                    <li key={h.id}>
                      <a
                        href={`#${h.id}`}
                        className="text-gray-600 hover:text-[var(--color-accent)] transition"
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