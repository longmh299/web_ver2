// app/admin/news/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deletePost } from "./actions";
import ConfirmDelete from "@/components/ConfirmDelete";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SearchParams = {
  q?: string;
  page?: string;
  cat?: string;
  ok?: string;
  err?: string;
};

export default async function NewsList({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { q = "", page = "1", cat = "", ok, err } = await searchParams;

  const take = 20;
  const current = Math.max(1, Number(page) || 1);

  const where: any = {};
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { slug: { contains: q, mode: "insensitive" } },
      { excerpt: { contains: q, mode: "insensitive" } },
      { tags: { has: q.toLowerCase() } },
    ];
  }
  if (cat) where.categoryId = Number(cat) || undefined;

  const [items, total, cats] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: [{ createdAt: "desc" }],
      select: {
        id: true,
        title: true,
        slug: true,
        published: true,
        createdAt: true,
        category: { select: { id: true, name: true } },
      },
      take,
      skip: (current - 1) * take,
    }),
    prisma.post.count({ where }),
    prisma.postCategory.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  const pages = Math.max(1, Math.ceil(total / take));

  return (
    <div className="mx-auto max-w-[1400px] px-3 lg:px-8 space-y-5 pb-24 md:pb-28">
      {/* Flash */}
      {(ok || err) && (
        <div
          className={`rounded-xl px-4 py-3 text-sm ${
            ok
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {ok ? "Đã thực hiện thành công." : `Lỗi: ${err}`}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Tin tức</h1>
        <Link
          href="/admin/news/new"
          className="rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
        >
          + Viết bài mới
        </Link>
      </div>

      {/* Filter (sticky) */}
      <div className="sticky top-0 z-10 -mx-3 lg:-mx-8 px-3 lg:px-8 py-3 bg-white/80 backdrop-blur border-b">
        <form className="mx-auto max-w-[1400px] flex flex-wrap items-center gap-2">
          <input
            name="q"
            defaultValue={q}
            placeholder="Tìm tiêu đề / slug / tag…"
            className="w-full sm:w-80 rounded-lg border px-3 py-2"
          />
          <select
            name="cat"
            defaultValue={cat}
            className="rounded-lg border px-3 py-2"
          >
            <option value="">— Tất cả chuyên mục —</option>
            {cats.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button className="rounded-lg border px-3 py-2">Lọc</button>
        </form>
      </div>

      {/* Hint mobile */}
      <div className="md:hidden text-xs text-gray-500">
        Vuốt trái/phải để xem đủ cột →
      </div>

      {/* Desktop table – đồng nhất với trang Sản phẩm */}
      <div className="hidden md:block rounded-2xl border bg-white shadow-sm overflow-x-auto">
        <table className="w-full table-fixed">
          {/* DÙNG MẢNG để tránh whitespace trong <colgroup> */}
          <colgroup>
            {[
              <col key="cb" style={{ width: 44 }} />,
              // Tiêu đề (kèm slug) cố định rộng
              <col key="title" style={{ width: 220 }} />,
              // Chuyên mục = phần còn lại (tính cố định bằng công thức)
              <col
                key="cat"
                style={{
                  width: "calc(100% - (44px + 620px + 110px + 120px))",
                }}
              />,
              // Trạng thái hẹp
              <col key="st" style={{ width: 110 }} />,
              // Thao tác hẹp
              <col key="act" style={{ width: 120 }} />,
            ]}
          </colgroup>

          <thead className="text-left text-sm text-gray-600">
            <tr className="[&>th]:px-4 [&>th]:py-3">
              <th />
              <th>Tiêu đề</th>
              <th>Chuyên mục</th>
              <th>Trạng thái</th>
              <th className="text-right">Thao tác</th>
            </tr>
          </thead>

          <tbody className="divide-y [&>tr>td]:px-4 [&>tr>td]:py-3">
            {items.map((p) => (
              <tr key={p.id} className="align-middle hover:bg-gray-50/60">
                {/* checkbox */}
                <td>
                  <input type="checkbox" aria-label={`select ${p.title}`} />
                </td>

                {/* Tiêu đề + slug (giống ô Sản phẩm bên trang SP) */}
                <td className="overflow-hidden">
                  <div className="min-w-0">
                    <div className="truncate font-medium">{p.title}</div>
                    <div className="truncate text-xs text-gray-500">
                      /{p.slug}
                    </div>
                  </div>
                </td>

                {/* Chuyên mục */}
                <td className="overflow-hidden">
                  <div className="truncate">
                    {p.category?.name || <span className="text-gray-400">—</span>}
                  </div>
                </td>

                {/* Trạng thái (nowrap) */}
                <td className="overflow-hidden whitespace-nowrap">
                  {p.published ? (
                    <span className="inline-flex h-6 items-center rounded-md bg-green-50 px-2 text-xs text-green-700">
                      Hiển thị
                    </span>
                  ) : (
                    <span className="inline-flex h-6 items-center rounded-md bg-gray-100 px-2 text-xs text-gray-700">
                      Nháp
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="overflow-hidden">
                  <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                    <Link
                      href={`/admin/news/${p.id}/edit`}
                      className="rounded border px-3 py-1.5 text-sm hover:bg-gray-50"
                    >
                      Sửa
                    </Link>
                    <ConfirmDelete
                      label="Xóa"
                      confirmText="Xóa bài này?"
                      action={deletePost}
                      hidden={{ id: String(p.id) }}
                      className="rounded border px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                    />
                  </div>
                </td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards – đồng bộ style SP */}
      <div className="md:hidden space-y-3">
        {items.map((p) => (
          <div key={p.id} className="rounded-xl border bg-white p-3 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs text-gray-500">#{p.id}</div>
                <div className="font-medium line-clamp-2">{p.title}</div>
                <div className="text-xs text-gray-500 truncate">/{p.slug}</div>
                <div className="mt-1 text-xs">
                  {p.category?.name ?? <span className="text-gray-400">—</span>}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                {p.published ? (
                  <span className="rounded bg-green-50 px-1.5 py-0.5 text-[11px] text-green-700 ring-1 ring-green-200">
                    Hiển thị
                  </span>
                ) : (
                  <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] text-gray-700 ring-1 ring-gray-200">
                    Nháp
                  </span>
                )}
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link
                href={`/admin/news/${p.id}/edit`}
                className="rounded border px-3 py-2 text-center text-sm"
              >
                Sửa
              </Link>
              <ConfirmDelete
                label="Xóa"
                confirmText="Xóa bài này?"
                action={deletePost}
                hidden={{ id: String(p.id) }}
                className="rounded border px-3 py-2 text-center text-sm text-red-600"
              />
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="rounded-xl border bg-white p-4 text-center text-gray-500">
            Không có dữ liệu
          </div>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex flex-wrap items-center gap-2">
          {Array.from({ length: pages }).map((_, i) => {
            const p = i + 1;
            const href = `/admin/news?${new URLSearchParams({
              q,
              page: String(p),
              cat,
            }).toString()}`;
            const active = p === current;
            return (
              <Link
                key={p}
                href={href}
                className={`rounded-lg px-3 py-1.5 text-sm ${
                  active ? "bg-blue-600 text-white" : "border hover:bg-gray-50"
                }`}
              >
                {p}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
