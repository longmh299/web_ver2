// app/danh-muc/[slug]/page.tsx

import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import CategoryChips from "@/components/CategoryChips";
import { prisma } from "@/lib/prisma";
import { abs } from "@/lib/site";
import { redirect, notFound } from "next/navigation";
import Image from "next/image";
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
    c.metaDescription ||
    `MCBROTHER cung cấp ${c.name.toLowerCase()} cho ngành thực phẩm, giúp tối ưu sản xuất và nâng cao hiệu suất.`;

  const url = c.canonicalUrl || abs(`/${c.slug}`);
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
  });

  if (!c) {
    const r = await prisma.slugRedirect.findUnique({
      where: { fromSlug: slug },
    });

    if (r?.entityType === "category") {
      redirect(`/${r.toSlug}`);
    }

    notFound();
  }

  // ==========================
  // Lấy category con
  // ==========================
  const children = await prisma.category.findMany({
    where: {
      parentId: c.id,
    },
    orderBy: [
      { order: "asc" },
      { name: "asc" },
    ],
    select: {
      id: true,
      name: true,
      slug: true,
      parentId: true,
    },
  });

  // ==========================
  // Chips
  // Nếu có con => hiện con
  // Không có con => hiện anh em cùng cấp
  // ==========================
  const relatedCategories =
    children.length > 0
      ? children
      : await prisma.category.findMany({
          where: {
            parentId: c.parentId,
          },
          orderBy: [
            { order: "asc" },
            { name: "asc" },
          ],
          select: {
            id: true,
            name: true,
            slug: true,
          },
        });

  // ==========================
  // Lấy product
  // ==========================
  const categoryIds =
    children.length > 0
      ? children.map((x) => x.id)
      : [c.id];

  const products = await prisma.product.findMany({
    where: {
      published: true,
      noindex: false,
      categoryId: {
        in: categoryIds,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
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
  });

  return (
    <main className="bg-[var(--color-bg)] text-slate-800">

      <section className="relative h-[320px] md:h-[420px] overflow-hidden bg-[#25282c]">
  <Image
    src={c.banner || "/images/banner2.jpg"}
    alt={c.name}
    fill
    priority
    sizes="100vw"
    className="
      object-cover
      object-center
      md:object-right
    "
  />

  <div className="absolute inset-0 bg-black/5" />

  <div
    className="
      relative
      h-full
      max-w-7xl
      xl:max-w-[1280px]
      mx-auto
      px-4
      flex
      items-center
      justify-center
      text-center
      text-white
    "
  >
    <div className="max-w-2xl">

      <h1 className="text-[28px] md:text-[36px] font-semibold">
        {c.name}
      </h1>

      <p className="mt-3 text-sm md:text-base text-white/85">
        {c.metaDescription ||
          `MCBROTHER cung cấp ${c.name.toLowerCase()} cho ngành thực phẩm, giúp tối ưu sản xuất và nâng cao hiệu suất.`}
      </p>

    </div>
  </div>

</section>

      <section className="py-12">
        <div className="max-w-7xl xl:max-w-[1280px] mx-auto px-4">

          <CategoryChips categories={relatedCategories} />

          {products.length > 0 ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 italic">
              Chưa có sản phẩm trong danh mục này
            </div>
          )}

        </div>
      </section>

    </main>
  );
}