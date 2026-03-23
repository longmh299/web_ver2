// app/tin-tuc/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

type SearchParams = {
  q?: string;
  categoryId?: string;
  page?: string;
};

const PER_PAGE = 12;

/* ============ helpers ============ */
function buildHref(
  base: string,
  params: Record<string, string | number | undefined | null>
) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v).length > 0)
      sp.set(k, String(v));
  });
  const qs = sp.toString();
  return qs ? `${base}?${qs}` : base;
}

function fmtDate(d?: Date | string | null) {
  if (!d) return "";
  const dt = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(dt);
}

/* ============ data ============ */
async function getData(params: SearchParams) {
  const q = (params.q ?? "").trim();
  const categoryId = params.categoryId ? Number(params.categoryId) : undefined;
  const page = Math.max(1, Number(params.page) || 1);

  const where: any = { published: true };
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { slug: { contains: q, mode: "insensitive" } },
      { excerpt: { contains: q, mode: "insensitive" } },
      { content: { contains: q, mode: "insensitive" } },
    ];
  }
  if (categoryId) where.categoryId = categoryId;

  const [count, items, categories] = await Promise.all([
    prisma.post.count({ where }),
    prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        coverImage: true,
        createdAt: true,
        category: { select: { id: true, name: true } },
      },
    }),
    prisma.postCategory.findMany({
      orderBy: [{ order: "asc" as const }, { name: "asc" as const }],
      select: { id: true, name: true },
    }),
  ]);

  return {
    q,
    categoryId,
    page,
    totalPages: Math.max(1, Math.ceil(count / PER_PAGE)),
    items,
    categories,
  };
}

/* ============ page ============ */
export default async function NewsPage({
  searchParams: spPromise,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await spPromise;
  const { q, categoryId, page, totalPages, items, categories } = await getData(
    sp
  );

  return (
    <section className="w-full bg-surface">
      <div className="container px-4 lg:px-6 py-6 md:py-8">
        {/* Header */}
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Tin tức
          </h1>

        {/* Search nhanh trên desktop */}
          {/* <form
            action="/tin-tuc"
            className="hidden sm:flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm"
          >
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Tìm bài viết…"
              className="w-64 outline-none text-sm placeholder:text-gray-400"
            />
            <select
              name="categoryId"
              defaultValue={categoryId ?? ""}
              className="rounded-lg border border-gray-200 px-2 py-1.5 text-sm outline-none"
            >
              <option value="">Tất cả chuyên mục</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-lg bg-primary px-3 py-1.5 text-sm text-white hover:brightness-110"
            >
              Tìm
            </button>
          </form> */}
        </div>

        {/* Chip category – cuộn ngang thân thiện mobile */}
        {/* <div className="mb-4 -mx-4 px-4 overflow-x-auto scrollbar-none">
          <div className="flex gap-2 min-w-max snap-x">
            <Link
              href={buildHref("/tin-tuc", { q })}
              className={`snap-start px-3 py-1.5 rounded-full border text-sm ${
                !categoryId
                  ? "bg-primary border-primary text-white"
                  : "bg-white border-gray-200 hover:bg-gray-50"
              }`}
            >
              Tất cả
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={buildHref("/tin-tuc", { q, categoryId: c.id })}
                className={`snap-start px-3 py-1.5 rounded-full border text-sm ${
                  Number(categoryId) === c.id
                    ? "bg-primary border-primary text-white"
                    : "bg-white border-gray-200 hover:bg-gray-50"
                }`}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div> */}

        {/* Form mobile (stack) */}
        <form
          action="/tin-tuc"
          className="sm:hidden mb-5 rounded-2xl border border-gray-100 bg-white p-3 shadow-card"
        >
          <div className="grid grid-cols-1 gap-2">
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Tìm bài viết…"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none"
            />
            <select
              name="categoryId"
              defaultValue={categoryId ?? ""}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none"
            >
              <option value="">Tất cả chuyên mục</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-lg bg-primary px-3 py-2 text-sm text-white"
            >
              Tìm kiếm
            </button>
          </div>
        </form>

        {/* GRID — mobile 1 cột, sm lên 2/3/4 cột */}
        {items.length === 0 ? (
          <div className="text-gray-500">Không có bài viết phù hợp.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {items.map((n) => (
              <Link
                key={n.id}
                href={`/tin-tuc/${n.slug}`}
                className="group block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-card transition-transform duration-300 ease-soft-out hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                {/* Ảnh lớn, 16:9 trên mobile cho đã mắt; lên desktop dùng 4:3 */}
                <div className="bg-gray-50 overflow-hidden">
                  <div className="aspect-[16/9] sm:aspect-[4/3]">
                    {n.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={n.coverImage}
                        alt={n.title}
                        className="h-full w-full object-cover transition-transform duration-300 ease-soft-out group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-400 text-sm">
                        No Image
                      </div>
                    )}
                  </div>
                </div>

                {/* Nội dung */}
                <div className="p-3 md:p-4">
                  {/* meta gọn gàng, không bị đè nhau */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-gray-500">
                    <time>{fmtDate(n.createdAt)}</time>
                    {n.category?.name && (
                      <>
                        <span className="hidden sm:inline" aria-hidden>•</span>
                        <span className="inline-flex items-center rounded-full border border-gray-200 px-2 py-0.5 bg-white">
                          {n.category.name}
                        </span>
                      </>
                    )}
                  </div>

                  <h3 className="mt-1 text-[15px] sm:text-[15px] font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {n.title}
                  </h3>

                  {/* Mobile: hiển thị mô tả 2 dòng; desktop cũng 2 dòng để đều */}
                  {n.excerpt && (
                    <p className="mt-1 text-[13px] text-gray-600 line-clamp-2">
                      {n.excerpt}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav
            aria-label="Pagination"
            className="mt-7 md:mt-9 flex items-center justify-center gap-1.5 md:gap-2"
          >
            <Link
              aria-label="Trang trước"
              href={buildHref("/tin-tuc", {
                q,
                categoryId,
                page: Math.max(1, page - 1),
              })}
              className={`px-3 py-2 rounded-lg border text-sm ${
                page === 1
                  ? "pointer-events-none opacity-40"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              Trước
            </Link>

            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, i) => {
                const p = i + 1;
                const show =
                  p === 1 ||
                  p === totalPages ||
                  Math.abs(p - page) <= 1 ||
                  (page <= 3 && p <= 4) ||
                  (page >= totalPages - 2 && p >= totalPages - 3);
                if (show) {
                  const active = p === page;
                  return (
                    <Link
                      key={p}
                      href={buildHref("/tin-tuc", { q, categoryId, page: p })}
                      className={`min-w-[36px] text-center px-2.5 py-2 rounded-lg border text-sm ${
                        active
                          ? "bg-primary border-primary text-white"
                          : "bg-white hover:bg-gray-50"
                      }`}
                      aria-current={active ? "page" : undefined}
                    >
                      {p}
                    </Link>
                  );
                }
                if ((p === page - 2 && p > 1) || (p === page + 2 && p < totalPages))
                  return (
                    <span key={p} className="px-2 text-gray-500">
                      …
                    </span>
                  );
                return null;
              })}
            </div>

            <Link
              aria-label="Trang sau"
              href={buildHref("/tin-tuc", {
                q,
                categoryId,
                page: Math.min(totalPages, page + 1),
              })}
              className={`px-3 py-2 rounded-lg border text-sm ${
                page === totalPages
                  ? "pointer-events-none opacity-40"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              Sau
            </Link>
          </nav>
        )}
      </div>
    </section>
  );
}
