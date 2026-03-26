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
      orderBy: [{ order: "asc" }, { name: "asc" }],
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

export default async function NewsPage({
  searchParams: spPromise,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await spPromise;
  const { q, categoryId, page, totalPages, items, categories } =
    await getData(sp);

  return (
    <section className="w-full bg-[var(--color-bg)]">
      <div className="container px-4 lg:px-6 py-6 md:py-8">

        {/* HEADER */}
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-800">
            Tin tức
          </h1>
        </div>

        {/* FORM MOBILE */}
        <form
          action="/tin-tuc"
          className="sm:hidden mb-5 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm"
        >
          <div className="grid grid-cols-1 gap-2">
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Tìm bài viết…"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]"
            />

            <select
              name="categoryId"
              defaultValue={categoryId ?? ""}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]"
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
              className="rounded-lg bg-[var(--color-primary)] px-3 py-2 text-sm text-white hover:bg-[var(--color-primary-dark)] transition"
            >
              Tìm kiếm
            </button>
          </div>
        </form>

        {/* GRID */}
        {items.length === 0 ? (
          <div className="text-gray-500">Không có bài viết phù hợp.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {items.map((n) => (
              <Link
                key={n.id}
                href={`/tin-tuc/${n.slug}`}
                className="group block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[var(--color-primary)]"
              >
                {/* IMAGE */}
                <div className="bg-gray-50 overflow-hidden">
                  <div className="aspect-[16/9] sm:aspect-[4/3]">
                    {n.coverImage ? (
                      <img
                        src={n.coverImage}
                        alt={n.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-400 text-sm">
                        No Image
                      </div>
                    )}
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-3 md:p-4">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-gray-500">
                    <time>{fmtDate(n.createdAt)}</time>
                    {n.category?.name && (
                      <>
                        <span className="hidden sm:inline">•</span>
                        <span className="inline-flex items-center rounded-full border border-gray-200 px-2 py-0.5 bg-white">
                          {n.category.name}
                        </span>
                      </>
                    )}
                  </div>

                  <h3 className="mt-1 text-[15px] font-semibold text-gray-900 line-clamp-2 group-hover:text-[var(--color-primary)] transition">
                    {n.title}
                  </h3>

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

        {/* PAGINATION */}
        {totalPages > 1 && (
          <nav className="mt-7 md:mt-9 flex items-center justify-center gap-2">
            <Link
              href={buildHref("/tin-tuc", {
                q,
                categoryId,
                page: Math.max(1, page - 1),
              })}
              className={`px-3 py-2 rounded-lg border text-sm ${
                page === 1
                  ? "opacity-40 pointer-events-none"
                  : "bg-white hover:border-[var(--color-primary)]"
              }`}
            >
              Trước
            </Link>

            <div className="hidden sm:flex gap-1">
              {Array.from({ length: totalPages }).map((_, i) => {
                const p = i + 1;
                const active = p === page;

                return (
                  <Link
                    key={p}
                    href={buildHref("/tin-tuc", { q, categoryId, page: p })}
                    className={`px-3 py-2 rounded-lg border text-sm ${
                      active
                        ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                        : "bg-white hover:border-[var(--color-primary)]"
                    }`}
                  >
                    {p}
                  </Link>
                );
              })}
            </div>

            <Link
              href={buildHref("/tin-tuc", {
                q,
                categoryId,
                page: Math.min(totalPages, page + 1),
              })}
              className={`px-3 py-2 rounded-lg border text-sm ${
                page === totalPages
                  ? "opacity-40 pointer-events-none"
                  : "bg-white hover:border-[var(--color-primary)]"
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