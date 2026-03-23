// app/admin/categories/[id]/page.tsx
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { updateCategory, deleteCategory } from '../actions';

export const dynamic = 'force-dynamic';

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;            // ✅ Next 15: params là Promise
  const catId = Number(id);
  if (!catId || Number.isNaN(catId)) notFound();

  const [category, parents] = await Promise.all([
    prisma.category.findUnique({
      where: { id: catId },
      select: {
        id: true, name: true, slug: true, order: true, parentId: true,
        banner: true, metaTitle: true, metaDescription: true,
        canonicalUrl: true, ogImage: true, noindex: true, nofollow: true,
      },
    }),
    prisma.category.findMany({
      where: { id: { not: catId } },       // ✅ dùng catId
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
      select: { id: true, name: true },
    }),
  ]);
  if (!category) notFound();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Sửa danh mục</h1>
        <Link href="/admin/categories" className="px-3 py-2 rounded border">← Quay lại</Link>
      </div>

      {/* CHỈ 1 FORM: mặc định submit -> updateCategory */}
      <form action={updateCategory} className="grid gap-4 md:grid-cols-2 bg-white rounded-2xl p-5 border">
        <input type="hidden" name="id" defaultValue={category.id} />

        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Tên *</label>
          <input name="name" defaultValue={category.name} required className="mt-1 w-full rounded-lg border px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium">Slug</label>
          <input name="slug" defaultValue={category.slug} className="mt-1 w-full rounded-lg border px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium">Thứ tự</label>
          <input type="number" name="order" defaultValue={category.order ?? 0} className="mt-1 w-full rounded-lg border px-3 py-2" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Danh mục cha</label>
          <select name="parentId" defaultValue={category.parentId ?? ''} className="mt-1 w-full rounded-lg border px-3 py-2">
            <option value="">— Không —</option>
            {parents.map((p) => (
              <option key={p.id} value={p.id.toString()}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* SEO */}
        <div className="md:col-span-2 grid gap-4 md:grid-cols-2 pt-2 border-t">
          <div>
            <label className="block text-sm font-medium">Banner (URL)</label>
            <input name="banner" defaultValue={category.banner ?? ''} className="mt-1 w-full rounded-lg border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">OG Image (URL)</label>
            <input name="ogImage" defaultValue={category.ogImage ?? ''} className="mt-1 w-full rounded-lg border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Meta title</label>
            <input name="metaTitle" defaultValue={category.metaTitle ?? ''} className="mt-1 w-full rounded-lg border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Canonical URL</label>
            <input name="canonicalUrl" defaultValue={category.canonicalUrl ?? ''} className="mt-1 w-full rounded-lg border px-3 py-2" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Meta description</label>
            <textarea name="metaDescription" rows={3} defaultValue={category.metaDescription ?? ''} className="mt-1 w-full rounded-lg border px-3 py-2" />
          </div>
          <div className="md:col-span-2 flex items-center gap-6">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" name="noindex" defaultChecked={!!category.noindex} className="h-4 w-4" />
              <span>Noindex</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" name="nofollow" defaultChecked={!!category.nofollow} className="h-4 w-4" />
              <span>Nofollow</span>
            </label>
          </div>
        </div>

        {/* Nút hành động */}
        <div className="md:col-span-2 flex gap-3">
          <button type="submit" className="rounded-lg bg-black px-5 py-2 text-white">
            Lưu
          </button>
          <button
            type="submit"
            formAction={deleteCategory}
            className="rounded-lg border px-5 py-2 hover:bg-red-50"
          >
            Xoá
          </button>
        </div>
      </form>
    </div>
  );
}
