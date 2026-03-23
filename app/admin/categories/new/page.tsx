import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { createCategory } from '../actions';

export const dynamic = 'force-dynamic';

export default async function NewCategoryPage() {
  const parents = await prisma.category.findMany({
    orderBy: [{ order: 'asc' }, { name: 'asc' }],
    select: { id: true, name: true },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Tạo danh mục</h1>
        <Link href="/admin/categories" className="px-3 py-2 rounded border">← Quay lại</Link>
      </div>

      <form action={createCategory} className="grid gap-4 md:grid-cols-2 bg-white rounded-2xl p-5 border">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Tên *</label>
          <input name="name" required className="mt-1 w-full rounded-lg border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Slug (để trống sẽ tự tạo)</label>
          <input name="slug" className="mt-1 w-full rounded-lg border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Thứ tự</label>
          <input type="number" name="order" defaultValue={0} className="mt-1 w-full rounded-lg border px-3 py-2" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Danh mục cha</label>
          <select name="parentId" defaultValue="" className="mt-1 w-full rounded-lg border px-3 py-2">
            <option value="">— Không —</option>
            {parents.map((p) => (
              <option key={p.id} value={p.id.toString()}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* SEO (tuỳ chọn) */}
        <div className="md:col-span-2 grid gap-4 md:grid-cols-2 pt-2 border-t">
          <div>
            <label className="block text-sm font-medium">Banner (URL)</label>
            <input name="banner" className="mt-1 w-full rounded-lg border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">OG Image (URL)</label>
            <input name="ogImage" className="mt-1 w-full rounded-lg border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Meta title</label>
            <input name="metaTitle" className="mt-1 w-full rounded-lg border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Canonical URL</label>
            <input name="canonicalUrl" className="mt-1 w-full rounded-lg border px-3 py-2" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Meta description</label>
            <textarea name="metaDescription" rows={3} className="mt-1 w-full rounded-lg border px-3 py-2" />
          </div>
          <div className="md:col-span-2 flex items-center gap-6">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" name="noindex" className="h-4 w-4" />
              <span>Noindex</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" name="nofollow" className="h-4 w-4" />
              <span>Nofollow</span>
            </label>
          </div>
        </div>

        <div className="md:col-span-2">
          <button className="rounded-lg bg-black px-5 py-2 text-white">Tạo</button>
        </div>
      </form>
    </div>
  );
}
