// app/admin/products/page.tsx
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { deleteProduct } from "./actions";
import ConfirmDelete from "@/components/ConfirmDelete";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SearchParams = {
  q?: string;
  page?: string;
  cat?: string;
  status?: "published" | "draft" | "";
  feat?: "1" | "";
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { q = "", page = "1", cat = "", status = "", feat = "" } =
    await searchParams;

  const take = 20;
  const current = Math.max(1, Number(page) || 1);

  const where: any = {};
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { slug: { contains: q, mode: "insensitive" } },
      { sku: { contains: q, mode: "insensitive" } }, // vẫn cho phép tìm SKU
    ];
  }
  if (cat) where.categoryId = Number(cat) || undefined;
  if (status === "published") where.published = true;
  if (status === "draft") where.published = false;
  if (feat === "1") where.isFeatured = true;

  const [items, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: [{ updatedAt: "desc" }],
      take,
      skip: (current - 1) * take,
      select: {
        id: true,
        name: true,
        slug: true,
        coverImage: true,
        published: true,
        isFeatured: true,
        updatedAt: true,
        category: { select: { id: true, name: true } },
      },
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  const pages = Math.max(1, Math.ceil(total / take));

  return (
    <div className="mx-auto max-w-6xl px-3 md:px-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold">Sản phẩm</h1>
          <p className="text-sm text-gray-500">
            {total.toLocaleString("vi-VN")} mục
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
        >
          + Thêm sản phẩm
        </Link>
      </div>

      {/* Filters */}
      <form className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
        <input
          name="q"
          defaultValue={q}
          placeholder="Tìm tên / slug…"
          className="rounded-lg border px-3 py-2"
        />
        <select
          name="cat"
          defaultValue={cat}
          className="rounded-lg border px-3 py-2"
        >
          <option value="">— Tất cả danh mục —</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          name="status"
          defaultValue={status}
          className="rounded-lg border px-3 py-2"
        >
          <option value="">— Trạng thái —</option>
          <option value="published">Hiển thị</option>
          <option value="draft">Nháp</option>
        </select>
        <select
          name="feat"
          defaultValue={feat}
          className="rounded-lg border px-3 py-2"
        >
          <option value="">— Nổi bật —</option>
          <option value="1">Nổi bật</option>
        </select>
        <button className="rounded-lg border px-3 py-2">Lọc</button>
      </form>

      {/* Hint mobile */}
      <div className="md:hidden text-xs text-gray-500">
        Vuốt trái/phải để xem đủ cột →
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border bg-white shadow-sm">
        <table className="w-full table-fixed">
          {/* 44px cho checkbox; phần còn lại: SP 50%, Danh mục 20%, Trạng thái 10%, Sửa/Xoá 20% */}
           <colgroup>
      <col style={{ width: 44 }} /> 
      <col style={{ width: 220 }} /> 
      <col style={{ width: "calc(100% - (44px + 520px + 110px + 120px))" }} />
      <col style={{ width: 110 }} />
      <col style={{ width: 120 }} />
    </colgroup>

          <thead className="text-left text-sm text-gray-600">
            <tr className="border-b">
              <th className="px-4 py-3">
                <input aria-label="select all" type="checkbox" disabled />
              </th>
              <th className="px-4 py-3">Sản phẩm</th>
              <th className="px-4 py-3">Danh mục</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3 text-right">Sửa / Xoá</th>
            </tr>
          </thead>

          <tbody className="divide-y text-[15px]">
            {items.map((p) => (
              <tr key={p.id} className="align-middle hover:bg-gray-50/60">
                {/* checkbox */}
                <td className="px-4 py-3">
                  <input type="checkbox" aria-label={`select ${p.name}`} />
                </td>

                {/* Product */}
                <td className="px-4 py-3 overflow-hidden">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* <div className="relative h-9 w-9 overflow-hidden rounded-full bg-gray-100 ring-1 ring-gray-200 shrink-0">
                      {p.coverImage ? (
                        <img
                          src={p.coverImage}
                          alt={p.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                          N/A
                        </div>
                      )}
                    </div> */}
                    <div className="min-w-0 w-full">
                      <div className="truncate font-medium">{p.name}</div>
                      <div className="truncate text-xs text-gray-500">
                        /{p.slug}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="px-4 py-3 overflow-hidden">
                  <div className="truncate">
                    {p.category?.name || <span className="text-gray-400">—</span>}
                  </div>
                </td>

                {/* Status (hẹp, nowrap) */}
                <td className="px-4 py-3 overflow-hidden whitespace-nowrap">
                  {p.published ? (
                    <span className="rounded bg-green-50 px-2 py-1 text-xs text-green-700 ring-1 ring-green-200">
                      Hiển thị
                    </span>
                  ) : (
                    <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 ring-1 ring-gray-200">
                      Nháp
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-4 py-3 overflow-hidden">
                  <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="rounded border px-3 py-1.5 text-sm hover:bg-gray-50"
                      title="Sửa"
                    >
                      Sửa
                    </Link>
                    <ConfirmDelete
                      label="Xoá"
                      confirmText="Xoá sản phẩm này?"
                      action={deleteProduct}
                      hidden={{ id: String(p.id) }}
                      className="rounded border px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                    />
                  </div>
                </td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-gray-500">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile giữ nguyên layout */}
      <div className="md:hidden space-y-3">
        {items.map((p) => (
          <div key={p.id} className="rounded-xl border bg-white p-3 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="h-10 w-10 overflow-hidden rounded-lg bg-gray-100 ring-1 ring-gray-200">
                  {p.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.coverImage}
                      alt={p.name}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="min-w-0">
                  <div className="truncate font-medium">{p.name}</div>
                  <div className="truncate text-xs text-gray-500">/{p.slug}</div>
                </div>
              </div>
              <div className="text-right space-x-1">
                {p.published ? (
                  <span className="rounded bg-green-50 px-1.5 py-0.5 text-[11px] text-green-700 ring-1 ring-green-200">
                    Hiển thị
                  </span>
                ) : (
                  <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] text-gray-700 ring-1 ring-gray-200">
                    Nháp
                  </span>
                )}
                {p.isFeatured && (
                  <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[11px] text-amber-700 ring-1 ring-amber-200">
                    Nổi bật
                  </span>
                )}
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-2 text-sm">
              <div className="rounded border bg-white px-3 py-2">
                <div className="text-xs text-gray-500">Danh mục</div>
                <div className="truncate">
                  {p.category?.name || <span className="text-gray-400">—</span>}
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <Link
                href={`/admin/products/${p.id}/edit`}
                className="flex-1 rounded border px-3 py-2 text-center text-sm"
              >
                Sửa
              </Link>
              <ConfirmDelete
                label="Xoá"
                confirmText="Xoá sản phẩm này?"
                action={deleteProduct}
                hidden={{ id: String(p.id) }}
                className="flex-1 rounded border px-3 py-2 text-center text-sm text-red-600"
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
            const href = `/admin/products?${new URLSearchParams({
              q,
              page: String(p),
              cat,
              status,
              feat,
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
