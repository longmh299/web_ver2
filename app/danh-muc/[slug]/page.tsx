// app/danh-muc/[slug]/page.tsx

import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { abs } from "@/lib/site";
import { redirect, notFound } from "next/navigation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ================= SEO ================= */
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;

  const c = await prisma.category.findUnique({
    where: { slug },
  });

  if (!c) return {};

  const title = c.metaTitle || c.name;
  const description =
    c.metaDescription || `Giải pháp ${c.name.toLowerCase()} tối ưu cho doanh nghiệp sản xuất.`;
  const url = c.canonicalUrl || abs(`/danh-muc/${c.slug}`);
  const ogImage = c.ogImage || abs("/images/placeholder.jpg");

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [{ url: ogImage }],
    },
    robots: {
      index: !c.noindex,
      follow: !c.nofollow,
    },
  };
}

/* ================= PAGE ================= */
export default async function CategoryPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const c = await prisma.category.findUnique({
    where: { slug },
    include: {
      children: {
        orderBy: { order: "asc" },
        include: {
          products: {
            where: { published: true, noindex: false },
            orderBy: { createdAt: "desc" },
            select: {
              id: true,
              slug: true,
              name: true,
              price: true,
              coverImage: true,
              short: true,
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!c) {
    const r = await prisma.slugRedirect.findUnique({
      where: { fromSlug: slug },
    });
    if (r?.entityType === "category") {
      redirect(`/danh-muc/${r.toSlug}`);
    }
    notFound();
  }

  return (
    <main className="bg-[var(--color-bg)] text-slate-800">

      {/* ===== HERO CATEGORY ===== */}
      <section className="relative">
        <div className="absolute inset-0 bg-black/60" />
        <img
          src={c.banner || "/images/banner2.jpg"}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="relative max-w-7xl xl:max-w-[1280px] mx-auto px-4 py-20 text-white text-center">
          <h1 className="text-[28px] md:text-[32px] font-semibold">
            {c.name.replace("Ngành ", "").toUpperCase()}
          </h1>

          <p className="mt-3 text-sm text-white/80 max-w-2xl mx-auto">
            {c.metaDescription ||
              `Tổng hợp các giải pháp máy móc cho ${c.name.toUpperCase()}`}
          </p>
        </div>
      </section>

      {/* ===== CONTENT ===== */}
      <section className="py-12">
        <div className="max-w-7xl xl:max-w-[1280px] mx-auto px-4">

          {/* ===== LOOP CATEGORY CON ===== */}
          {c.children.map((child) => (
            <div key={child.id} className="mb-12">

              {/* TITLE */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[18px] font-semibold text-[var(--color-accent)]">
                  {child.name}
                </h2>

                {/* <Link
                  href={`/danh-muc/${child.slug}`}
                  className="text-sm text-gray-500 hover:text-black"
                >
                  Xem tất cả →
                </Link> */}
              </div>

              {/* PRODUCTS */}
              {child.products.length > 0 ? (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

                  {child.products.slice(0, 8).map((p) => (
                    <ProductCard key={p.id} p={p} />
                  ))}

                </div>
              ) : (
                <div className="text-sm text-gray-400 italic">
                  Chưa có sản phẩm
                </div>
              )}

            </div>
          ))}

        </div>
      </section>

    </main>
  );
}