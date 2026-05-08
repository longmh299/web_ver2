// app/san-pham/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";
import { cache } from "react";

export const runtime = "nodejs";
export const revalidate = 60;
type SearchParams = {
  q?: string;
  categoryId?: string;
  cat?: string;
  page?: string;
};

const PER_PAGE = 8;

/* ================= CACHE ================= */

// cache categories
const getCategories = cache(async () => {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, parentId: true, slug: true },
  });
});

// cache category children
const getCategoryIds = cache(async (categoryId: number) => {
  const children = await prisma.category.findMany({
    where: { parentId: categoryId },
    select: { id: true },
  });

  return [categoryId, ...children.map((c) => c.id)];
});

/* ================= DATA ================= */
async function getData(params: SearchParams) {
  const q = (params.q || "").trim();
  const rawCatId = (params.categoryId ?? "").trim();
  const catSlug = (params.cat ?? "").trim();
  const page = Math.max(1, Number(params.page) || 1);

  let categoryId: number | undefined = /^\d+$/.test(rawCatId)
    ? Number(rawCatId)
    : undefined;

  // 🔥 resolve slug → id (chỉ khi cần)
  if (!categoryId && catSlug) {
    const cat = await prisma.category.findUnique({
      where: { slug: catSlug },
      select: { id: true },
    });
    categoryId = cat?.id;
  }

  const where: any = {};

  // 🔥 search (giữ nguyên nhưng DB phải có GIN index)
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { short: { contains: q, mode: "insensitive" } },
    ];
  }

  // 🔥 category filter (đã cache)
  if (categoryId) {
    const ids = await getCategoryIds(categoryId);
    where.categoryId = { in: ids };
  }

  // 🚀 chạy song song
  const [items, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE + 1, // 🔥 trick bỏ count
      select: {
        id: true,
        slug: true,
        name: true,
        coverImage: true,
        price: true,
        short: true,
      },
    }),
    getCategories(),
  ]);

  // 🔥 pagination không cần count
  const hasNextPage = items.length > PER_PAGE;
  const finalItems = hasNextPage ? items.slice(0, PER_PAGE) : items;

  return {
    q,
    categoryId,
    page,
    hasNextPage,
    items: finalItems,
    categories,
  };
}
function buildHref(
  base: string,
  params: Record<string, string | number | undefined>
) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined) sp.set(k, String(v));
  });
  return `${base}?${sp.toString()}`;
}

/* ================= PAGE ================= */
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const { q, categoryId, page, hasNextPage, items, categories } =
    await getData(sp);

  return (
    <main className="bg-[var(--color-bg)] text-slate-800">

      <section className="relative overflow-hidden min-h-[340px]">

        {/* BG */}
        <img
          src="https://res.cloudinary.com/ds55hfvx4/image/upload/v1778214441/ChatGPT_Image_11_26_29_8_thg_5_2026_vuknuv.png"
          className="
      absolute inset-0
      w-full h-full
      object-cover
      object-center
    "
        />

        {/* overlay */}
        <div
          className="
      absolute inset-0
      bg-gradient-to-r
      from-slate-900/80
      via-slate-900/55
      to-slate-900/20
    "
        />

        {/* content */}
        <div
          className="
      relative
      max-w-7xl xl:max-w-[1280px]
      mx-auto
      px-4
      min-h-[340px]
      flex
      items-center
    "
        >

          <div className="max-w-2xl text-white">

            <p className="text-cyan-300 font-medium mb-3">
              Thiết bị công nghiệp
            </p>

            <h1 className="text-[44px] md:text-[56px] leading-tight font-bold">
              Tất cả sản phẩm
            </h1>

            <p className="mt-5 text-white/80 text-lg leading-relaxed">
              Giải pháp máy chế biến — đóng gói tối ưu cho doanh nghiệp sản xuất thực phẩm.
            </p>

          </div>

        </div>
      </section>

      {/* ===== FILTER (NEW) ===== */}
      <CategoryFilter categories={categories} />

      {/* ===== CONTENT ===== */}
      <section className="py-10">
        <div className="max-w-7xl xl:max-w-[1280px] mx-auto px-4">

          {/* GRID */}
          {items.length === 0 ? (
            <div className="text-gray-500">Không có sản phẩm.</div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {items.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          )}

          {/* PAGINATION */}
          {hasNextPage && (
            <div className="mt-10 flex justify-center">
              <Link
                href={buildHref("/san-pham", {
                  q,
                  categoryId,
                  page: page + 1,
                })}
                className="px-4 py-2 border rounded bg-white hover:bg-gray-100"
              >
                Xem thêm
              </Link>
            </div>
          )}

        </div>
      </section>
    </main>
  );
}