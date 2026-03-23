// app/san-pham/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SearchParams = {
  q?: string;
  categoryId?: string;
  cat?: string;
  page?: string;
};

const PER_PAGE = 8;

/* ================= DATA ================= */
async function getData(params: SearchParams) {
  const q = (params.q || "").trim();
  const rawCatId = (params.categoryId ?? "").trim();
  const catSlug = (params.cat ?? "").trim();
  const page = Math.max(1, Number(params.page) || 1);

  let categoryId: number | undefined = /^\d+$/.test(rawCatId)
    ? Number(rawCatId)
    : undefined;

  if (!categoryId && catSlug) {
    const cat = await prisma.category.findUnique({
      where: { slug: catSlug },
      select: { id: true },
    });
    categoryId = cat?.id;
  }

  const where: any = {};
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { short: { contains: q, mode: "insensitive" } },
    ];
  }
  // if (categoryId) where.categoryId = categoryId;
if (categoryId) {
  // lấy danh mục con
  const children = await prisma.category.findMany({
    where: { parentId: categoryId },
    select: { id: true },
  });

  const ids = [categoryId, ...children.map((c) => c.id)];

  where.categoryId = { in: ids };
}
  const count = await prisma.product.count({ where });

  const items = await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * PER_PAGE,
    take: PER_PAGE,
    select: {
      id: true,
      slug: true,
      name: true,
      short: true,
      coverImage: true,
      price: true,
      category: { select: { id: true, name: true, parentId: true } },
    },
  });

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, parentId: true }
  });

  return {
    q,
    categoryId,
    page,
    totalPages: Math.max(1, Math.ceil(count / PER_PAGE)),
    items,
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
  const { q, categoryId, page, totalPages, items, categories } =
    await getData(sp);

  return (
    <main className="bg-[var(--color-bg)] text-slate-800">

      {/* ===== HERO ===== */}
      <section className="relative">
        <img
          src="/images/banner2.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative max-w-7xl xl:max-w-[1280px] mx-auto px-4 py-20 text-center text-white">
          <h1 className="text-[30px] font-semibold">Tất cả sản phẩm</h1>
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
          {totalPages > 1 && (
            <div className="mt-10 flex justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => {
                const pnum = i + 1;
                const active = pnum === page;

                return (
                  <Link
                    key={pnum}
                    href={buildHref("/san-pham", {
                      q,
                      categoryId,
                      page: pnum,
                    })}
                    className={`px-3 py-2 border rounded text-sm ${
                      active
                        ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    {pnum}
                  </Link>
                );
              })}
            </div>
          )}

        </div>
      </section>
    </main>
  );
}