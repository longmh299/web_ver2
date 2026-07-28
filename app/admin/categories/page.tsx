import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { deleteCategory } from './actions';
import ConfirmDelete from '@/components/ConfirmDelete';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const items = await prisma.category.findMany({
    orderBy: [{ order: 'asc' }, { name: 'asc' }],
    select: {
      id: true, name: true, slug: true, order: true, parentId: true,
      parent: { select: { name: true } },
      _count: { select: { products: true, children: true } },
    },
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold">Danh mục sản phẩm</h1>
          <p className="text-sm text-gray-500">
            {items.length.toLocaleString('vi-VN')} danh mục (gồm cả gian hàng gốc &amp; danh mục con)
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700 font-medium"
        >
          + Tạo danh mục
        </Link>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="text-left text-gray-600">
            <tr className="border-b">
              <th className="px-4 py-3">Tên</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Danh mục cha</th>
              <th className="px-4 py-3 text-center">Con</th>
              <th className="px-4 py-3 text-center">SP</th>
              <th className="px-4 py-3">Thứ tự</th>
              <th className="px-4 py-3 text-right">Sửa / Xoá</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50/60">
                <td className="px-4 py-3 font-medium">
                  {c.name}
                  {!c.parentId && (
                    <span className="ml-2 rounded bg-blue-50 px-1.5 py-0.5 text-[11px] text-blue-700 ring-1 ring-blue-200">
                      Gian hàng gốc
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-500">/{c.slug}</td>
                <td className="px-4 py-3">
                  {c.parent?.name ?? <span className="text-gray-400">—</span>}
                </td>
                <td className="px-4 py-3 text-center">{c._count.children}</td>
                <td className="px-4 py-3 text-center">{c._count.products}</td>
                <td className="px-4 py-3">{c.order}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                    <Link
                      href={`/admin/categories/${c.id}`}
                      className="rounded border px-3 py-1.5 text-sm hover:bg-gray-50"
                    >
                      Sửa
                    </Link>
                    <ConfirmDelete
                      label="Xoá"
                      confirmText="Xoá danh mục này? Sản phẩm/danh mục con bên trong có thể bị ảnh hưởng."
                      action={deleteCategory}
                      hidden={{ id: String(c.id) }}
                      className="rounded border px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                    />
                  </div>
                </td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td className="px-4 py-10 text-center text-gray-500" colSpan={7}>
                  Chưa có danh mục nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {items.map((c) => (
          <div key={c.id} className="rounded-xl border bg-white p-3 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate font-medium">
                  {c.name}
                  {!c.parentId && (
                    <span className="ml-2 rounded bg-blue-50 px-1.5 py-0.5 text-[11px] text-blue-700 ring-1 ring-blue-200">
                      Gốc
                    </span>
                  )}
                </div>
                <div className="truncate text-xs text-gray-500">/{c.slug}</div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded border bg-white px-3 py-2">
                <div className="text-xs text-gray-500">Danh mục cha</div>
                <div className="truncate">{c.parent?.name ?? '—'}</div>
              </div>
              <div className="rounded border bg-white px-3 py-2">
                <div className="text-xs text-gray-500">Con / SP</div>
                <div>{c._count.children} / {c._count.products}</div>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <Link
                href={`/admin/categories/${c.id}`}
                className="flex-1 rounded border px-3 py-2 text-center text-sm"
              >
                Sửa
              </Link>
              <ConfirmDelete
                label="Xoá"
                confirmText="Xoá danh mục này?"
                action={deleteCategory}
                hidden={{ id: String(c.id) }}
                className="flex-1 rounded border px-3 py-2 text-center text-sm text-red-600"
              />
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="rounded-xl border bg-white p-4 text-center text-gray-500">
            Chưa có danh mục nào
          </div>
        )}
      </div>
    </div>
  );
}