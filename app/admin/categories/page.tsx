import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { deleteCategory } from './actions';

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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Danh mục</h1>
        <Link href="/admin/categories/new" className="rounded-lg bg-black text-white px-4 py-2">
          + Tạo danh mục
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-3 py-2">Tên</th>
              <th className="px-3 py-2">Slug</th>
              <th className="px-3 py-2">Thứ tự</th>
              <th className="px-3 py-2">Danh mục cha</th>
              <th className="px-3 py-2">SP</th>
              <th className="px-3 py-2 w-40">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="px-3 py-2 font-medium">{c.name}</td>
                <td className="px-3 py-2 text-gray-600">{c.slug}</td>
                <td className="px-3 py-2">{c.order}</td>
                <td className="px-3 py-2">{c.parent?.name ?? '—'}</td>
                <td className="px-3 py-2">{c._count.products}</td>
                <td className="px-3 py-2">
                  <div className="flex gap-2">
                    <Link href={`/admin/categories/${c.id}`} className="px-3 py-1 rounded border">
                      Sửa
                    </Link>
                    <form action={deleteCategory}>
                      <input type="hidden" name="id" defaultValue={c.id} />
                      <button className="px-3 py-1 rounded border hover:bg-red-50">
                        Xoá
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td className="px-3 py-6 text-center text-gray-500" colSpan={6}>
                  Chưa có danh mục
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
