// app/san-pham/[slug]/page.tsx
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Check } from "lucide-react";
export const dynamic = 'force-dynamic';
import { ShieldCheck, Truck, BadgeCheck } from "lucide-react";
import { cache } from "react";

/* ===================== CONFIG ===================== */
// ĐỔI SANG ZALO CỦA BẠN
const ZALO_URL = 'https://zalo.me/0834551888';
/* ================================================== */

export const revalidate = 60;

/* ===================== TYPES ===================== */

type Params = { slug: string };

type FAQ = {
  question: string;
  answer: string;
};

type SpecTable = {
  columns: string[];
  rows: { label: string; values: string[] }[];
};

/* ===================== HELPERS ===================== */

function formatVND(n: number) {
  try {
    return new Intl.NumberFormat('vi-VN').format(n) + '₫';
  } catch {
    return `${n}₫`;
  }
}

function cld(url?: string | null, w = 900, h = 600) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes('res.cloudinary.com')) {
      return url.replace(
        '/upload/',
        `/upload/c_fill,g_auto,f_auto,q_auto,w_${w},h_${h}/`
      );
    }
  } catch {}
  return url;
}

function cldSet(url?: string | null, baseW = 900, baseH = 600) {
  if (!url) return undefined;
  const W = [480, 720, baseW, 1200];
  return W.map(
    (w) => `${cld(url, w, Math.round((w * baseH) / baseW))} ${w}w`
  ).join(', ');
}

function decodeHtmlEntities(html?: string | null) {
  if (!html) return '';
  return html
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function normalizeDescHeadings(html: string) {
  return html
    .replace(/<h1(\s|>)/gi, '<h2$1')
    .replace(/<\/h1>/gi, '</h2>');
}

/* ===================== DATA ===================== */

// 🔥 cache để tránh query 2 lần (page + metadata)
const getProduct = cache(async (slug: string) => {
  return prisma.product.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      short: true,
      description: true,
      price: true,
      coverImage: true,
      videoUrl: true,
      power: true,
      voltage: true,
      weight: true,
      dimensions: true,
      functions: true,
      material: true,
      specTable: true,
      faqs: true,
      published: true,
      categoryId: true,
      sku: true,
      metaTitle: true,
      metaDescription: true,
      canonicalUrl: true,
      ogImage: true,
      noindex: true,
      nofollow: true,
      category: {
        select: { id: true, name: true, slug: true },
      },
      attributes: {
        select: { name: true, value: true },
        orderBy: { sort: 'asc' },
      },
    },
  });
});

/* ===================== SEO ===================== */

export async function generateMetadata(
  { params: paramsPromise }: { params: Promise<Params> }
): Promise<Metadata> {
  const { slug } = await paramsPromise;
  const p = await getProduct(slug);

  if (!p) return {};

  const title = p.metaTitle || p.name;
  const description = p.metaDescription || p.short || undefined;

  return {
    title,
    description,
    alternates: p.canonicalUrl
      ? { canonical: p.canonicalUrl }
      : undefined,
    openGraph: {
      title,
      description,
      images: p.ogImage || p.coverImage
        ? [String(p.ogImage || p.coverImage)]
        : undefined,
    },
    robots: {
      index: !(p.noindex ?? false),
      follow: !(p.nofollow ?? false),
    },
  };
}
function PriceInline({
  price,
  noAnchor = false,
}: {
  price?: number | null;
  noAnchor?: boolean;
}) {
  if (typeof price === 'number') return <>Giá: {formatVND(price)}</>;
  return <span>Giá: Liên hệ</span>;
}
/* ===================== PAGE ===================== */

export default async function ProductDetailPage(
  { params: paramsPromise }: { params: Promise<Params> }
) {
  const { slug } = await paramsPromise;

  const p = await getProduct(slug);

  if (!p || !p.published) {
    return <div>Không tìm thấy sản phẩm</div>;
  }

  // 🔥 TYPE SAFE
  const specTable = p.specTable as SpecTable | null;
  const faqs = (p.faqs as FAQ[]) || [];

  // 🔥 related (không block getProduct)
  const related = await prisma.product.findMany({
    where: p.categoryId
      ? { published: true, categoryId: p.categoryId, id: { not: p.id } }
      : { published: true, id: { not: p.id } },
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    take: 8,
    select: {
      id: true,
      slug: true,
      name: true,
      coverImage: true,
      price: true,
      short: true,
    },
  });

  // 🔥 description xử lý
  const rawDescHtml = decodeHtmlEntities(p.description);
  const descHtml = rawDescHtml
    ? normalizeDescHeadings(rawDescHtml)
    : '';

  const mainImg = cld(p.coverImage, 900, 600);
  const mainSrcSet = cldSet(p.coverImage, 900, 600);

  // 🔥 JSON-LD
  const additionalProps: { name: string; value: string }[] = [];

  const pushIf = (name: string, v?: string | null) => {
    if (v && v.trim()) additionalProps.push({ name, value: v });
  };

  pushIf('Công suất', p.power);
  pushIf('Điện áp', p.voltage);
  pushIf('Cân nặng', p.weight);
  pushIf('Kích thước', p.dimensions);
  pushIf('Chức năng', p.functions);
  pushIf('Vật liệu', p.material);

  for (const a of p.attributes) {
    if (a.name && a.value) {
      additionalProps.push({ name: a.name, value: a.value });
    }
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    sku: p.sku || undefined,
    image: p.coverImage ? [p.coverImage] : undefined,
    description: p.metaDescription || p.short || undefined,
    offers:
      typeof p.price === 'number'
        ? {
            '@type': 'Offer',
            priceCurrency: 'VND',
            price: String(p.price),
            availability: 'https://schema.org/InStock',
          }
        : undefined,
    additionalProperty: additionalProps.map((x) => ({
      '@type': 'PropertyValue',
      name: x.name,
      value: x.value,
    })),
  };
  // app/san-pham/[slug]/page.tsx
  // (GIỮ NGUYÊN TOÀN BỘ IMPORT + HELPER + SEO + QUERY)
  return (
    <main className="bg-[var(--color-bg)] text-slate-800">

      {/* ===== HERO ===== */}
      <section className="relative">
        <img
          src="/images/banner2.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative max-w-7xl xl:max-w-[1280px] mx-auto px-4 py-16 text-white">

          {/* breadcrumb */}
          <div className="text-sm text-white/80 mb-3">
            <Link href="/" className="hover:underline">Trang chủ</Link>
            <span className="px-2">/</span>
            <Link href="/san-pham" className="hover:underline">Sản phẩm</Link>
            {p.category && (
              <>
                <span className="px-2">/</span>
                <Link href={`/danh-muc/${p.category.slug}`} className="hover:underline">
                  {p.category.name}
                </Link>
              </>
            )}
          </div>

          <h1 className="text-[28px] md:text-[34px] font-semibold leading-snug max-w-3xl">
            {p.name}
          </h1>

          {p.short && (
            <p className="mt-2 text-sm text-white/80 max-w-2xl">
              {p.short}
            </p>
          )}
        </div>
      </section>

      {/* ===== CONTENT ===== */}
      <section className="py-10">
        <div className="max-w-7xl xl:max-w-[1280px] mx-auto px-4">

          <div className="grid lg:grid-cols-2 gap-10">

            {/* ===== LEFT ===== */}
            <div className="space-y-6">

              {/* IMAGE */}
              <div className="bg-white rounded-2xl border overflow-hidden shadow-sm">
                <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden group">
                  {mainImg ? (
                    <img
                      src={mainImg}
                      srcSet={mainSrcSet}
                      alt={p.name}
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No image
                    </div>
                  )}
                </div>
              </div>

              {/* VIDEO (đẩy lên ngay dưới ảnh) */}
              {p.videoUrl && (
                <div className="mt-10">
                  <h2 className="text-lg font-semibold mb-3">Video vận hành</h2>

                  <div className="bg-white border rounded-xl p-3">
                    {(() => {
                      const url = p.videoUrl || '';

                      const isShort =
                        url.includes('shorts') ||
                        url.includes('tiktok') ||
                        url.includes('reel');

                      const isVideoFile = /\.(mp4|webm|ogg)$/i.test(url);

                      const embedUrl = url
                        .replace('youtu.be/', 'youtube.com/embed/')
                        .replace('shorts/', 'embed/');

                      return (
                        <div
                          className="relative mx-auto rounded-lg overflow-hidden bg-black"
                          style={{
                            paddingTop: isShort ? '177.78%' : '56.25%', // 9:16 vs 16:9
                            maxWidth: isShort ? 420 : '100%',
                          }}
                        >
                          {isVideoFile ? (
                            <video
                              src={url}
                              controls
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          ) : (
                            <iframe
                              src={embedUrl}
                              className="absolute inset-0 w-full h-full"
                              allowFullScreen
                            />
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

            </div>

            {/* ===== RIGHT (STICKY) ===== */}
            <div className="space-y-6 lg:sticky top-24 h-fit">

              {/* PRICE */}
              <div className="text-[28px] font-bold text-[var(--color-primary-dark)]">
                <PriceInline price={p.price} />
              </div>

              {/* CTA */}
              <div className="flex gap-3">
                <a
                  href={ZALO_URL}
                  className="flex-1 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white text-center py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition"
                >
                  Nhận báo giá
                </a>

                <a
                  href="tel:0834551888"
                  className="flex-1 border border-[var(--color-border)] text-center py-3 rounded-xl hover:bg-gray-50 hover:shadow-sm hover:border-[var(--color-primary)] transition"
                >
                  Gọi ngay
                </a>
              </div>

              {/* TRUST */}


              <div className="bg-[var(--color-primary)]/5 border-[var(--color-primary)]/20 rounded-xl p-4 shadow-sm">
                <div className="space-y-2 text-sm text-gray-700">

                  <div className="flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4 text-[var(--color-accent)]" />
                    Hàng chính hãng
                  </div>

                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[var(--color-accent)]" />
                    Bảo hành 12 tháng
                  </div>

                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[var(--color-accent)]" />
                    Giao hàng toàn quốc
                  </div>

                </div>
              </div>

              {/* SPECS */}
              {(p.power || p.voltage || p.weight || p.dimensions || p.functions || p.material) && (
                <div className="bg-white border border-[var(--color-border)] rounded-2xl p-5 shadow-md">
                  <h2 className="text-base font-semibold mb-3 text-[var(--color-primary-dark)]">
                    Thông số kỹ thuật
                  </h2>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {p.power && <div className="bg-gray-20 p-2 rounded"><b>Công suất:</b> {p.power}</div>}
                    {p.voltage && <div className="bg-gray-20 p-2 rounded"><b>Điện áp:</b> {p.voltage}</div>}
                    {p.weight && <div className="bg-gray-20 p-2 rounded"><b>Cân nặng:</b> {p.weight}</div>}
                    {p.dimensions && <div className="bg-gray-20 p-2 rounded"><b>Kích thước:</b> {p.dimensions}</div>}
                    {p.functions && <div className="bg-gray-20 p-2 rounded"><b>Chức năng:</b> {p.functions}</div>}
                    {p.material && <div className="bg-gray-20 p-2 rounded"><b>Vật liệu:</b> {p.material}</div>}
                  </div>
                </div>
              )}

              {/* HIGHLIGHT */}
              <div className="bg-gray-50 border rounded-xl p-4 shadow-sm">
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[var(--color-accent)]" />
                    Công suất ổn định
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[var(--color-accent)]" />
                    Độ bền cao
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[var(--color-accent)]" />
                    Phù hợp sản xuất
                  </li>
                </ul>
              </div>

            </div>
          </div>


          {/* ===== DESCRIPTION ===== */}
          {(descHtml || p.specTable) && (
            <div className="mt-12 space-y-6">

              {/* TITLE */}
              <h2 className="text-xl font-semibold tracking-tight">
                Mô tả chi tiết
              </h2>

              {/* ===== TABLE (ưu tiên hiển thị) ===== */}
              {p.specTable && (() => {
                const specTable = p.specTable as {
                  columns: string[];
                  rows: { label: string; values: string[] }[];
                };

                const columns = specTable.columns || [];
                const rows = specTable.rows || [];

                return (
                  <div className="overflow-x-auto">
                    <div className="bg-white border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">

                      {/* HEADER */}
                      <div
                        className="grid text-sm font-semibold bg-gray-50"
                        style={{ gridTemplateColumns: `200px repeat(${columns.length}, 1fr)` }}
                      >
                        <div className="p-3">Thông số</div>

                        {columns.map((col, i) => (
                          <div key={i} className="p-3 text-center">
                            {col}
                          </div>
                        ))}
                      </div>

                      {/* ROWS */}
                      {rows.map((row, i) => (
                        <div
                          key={i}
                          className={`grid text-sm border-t border-[var(--color-border)] ${i % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }`}
                          style={{ gridTemplateColumns: `200px repeat(${columns.length}, 1fr)` }}
                        >
                          <div className="p-3 text-[var(--color-muted)] font-medium">
                            {row.label}
                          </div>

                          {row.values?.map((val, j) => (
                            <div key={j} className="p-3 text-center font-medium">
                              {val}
                            </div>
                          ))}
                        </div>
                      ))}

                    </div>
                  </div>
                );
              })()}

              {/* ===== HTML CONTENT (CMS) ===== */}
              {descHtml && (
                <div className="bg-white border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">

                  <div
                    className="blog-content prose max-w-none prose-slate
                     prose-headings:text-[var(--color-primary-dark)]
                     prose-table:border prose-table:border-[var(--color-border)]
                     prose-th:bg-gray-50 prose-th:font-semibold
                     prose-td:align-middle"
                    dangerouslySetInnerHTML={{ __html: descHtml }}
                  />

                </div>
              )}

            </div>
          )}
          {/* ===== FAQ ===== */}
          {Array.isArray(p.faqs) && p.faqs.length > 0 && (
            <div className="mt-12 space-y-4">
              <h2 className="text-xl font-semibold tracking-tight">
                Câu hỏi thường gặp
              </h2>

              <div className="bg-white border border-[var(--color-border)] rounded-2xl divide-y shadow-sm">
                {p.faqs.map((item: any, i: number) => (
                  <details key={i} className="group p-4 cursor-pointer">
                    <summary className="flex justify-between items-center font-medium list-none">
                      {item.question}
                      <span className="transition group-open:rotate-180">▼</span>
                    </summary>

                    <div className="mt-2 text-sm text-[var(--color-muted)] leading-relaxed">
                      {item.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )}
          {/* ===== RELATED ===== */}
          {related.length > 0 && (
            <div className="mt-14">
              <h2 className="text-[20px] font-semibold mb-6 text-center">
                Sản phẩm liên quan
              </h2>

              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {related.map((rp) => (
                  <Link key={rp.id} href={`/san-pham/${rp.slug}`}>
                    <div className="group bg-white border rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition">

                      <div className="h-40 bg-gray-100 overflow-hidden">
                        <img
                          src={rp.coverImage || "/images/placeholder.jpg"}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                      </div>

                      <div className="p-4">
                        <h3 className="text-sm font-semibold line-clamp-2">
                          {rp.name}
                        </h3>

                        <div className="mt-2 text-red-500 text-sm font-medium">
                          <PriceInline price={rp.price} />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ===== MOBILE CTA ===== */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t p-3 flex gap-2 md:hidden">
        <a
          href={ZALO_URL}
          className="flex-1 text-center py-3 rounded bg-[var(--color-accent)] text-white font-semibold text-base"
        >
          Báo giá
        </a>
        <a
          href="tel:0834551888"
          className="flex-1 text-center py-3 rounded border"
        >
          Gọi
        </a>
      </div>

    </main>
  );
}
