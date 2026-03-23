import Link from "next/link";
import { createPost } from "../actions";
import ImageField from "@/components/ImageField";
import RichEditor from "@/components/RichEditor";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  const cats = await prisma.postCategory.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Viết bài mới</h1>
        <Link href="/admin/news" className="rounded bg-gray-100 px-3 py-2 hover:bg-gray-200">
          ← Quay lại
        </Link>
      </div>

      <form action={createPost} className="grid gap-6 md:grid-cols-3">
        <section className="md:col-span-2 space-y-6">
          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-5 py-3 font-medium">Thông tin cơ bản</div>
            <div className="grid gap-4 p-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium">Tiêu đề *</label>
                <input name="title" required className="mt-1 w-full rounded-lg border px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium">Slug</label>
                <input name="slug" placeholder="tu-dong-tao-neu-de-trong" className="mt-1 w-full rounded-lg border px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium">Chuyên mục</label>
                <select name="categoryId" className="mt-1 w-full rounded-lg border px-3 py-2" defaultValue="">
                  <option value="">— Chưa chọn —</option>
                  {cats.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium">Mô tả ngắn (excerpt)</label>
                <input name="excerpt" placeholder="Tóm tắt 1–2 câu…" className="mt-1 w-full rounded-lg border px-3 py-2" />
              </div>

              <div className="md:col-span-2">
                <ImageField
                  name="coverImage"
                  label="Ảnh đại diện"
                  folder="mcbrother/posts"
                  placeholder="Dán URL ảnh hoặc bấm Upload"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium">Tags (phân tách bằng dấu phẩy)</label>
                <input name="tags" placeholder="máy đóng gói, công nghệ thực phẩm, mcbrother" className="mt-1 w-full rounded-lg border px-3 py-2" />
              </div>

              <div className="flex items-center gap-6 md:col-span-2">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" name="published" value="1" defaultChecked className="h-4 w-4" />
                  <span>Hiển thị</span>
                </label>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-5 py-3 font-medium">Nội dung</div>
            <div className="p-5">
              <RichEditor name="content" />
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-5 py-3 font-medium">SEO</div>
            <div className="space-y-4 p-5">
              <div>
                <label className="block text-sm font-medium">Meta title</label>
                <input name="metaTitle" className="mt-1 w-full rounded-lg border px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium">Meta description</label>
                <textarea name="metaDescription" rows={3} className="mt-1 w-full rounded-lg border px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium">Canonical URL</label>
                <input name="canonicalUrl" className="mt-1 w-full rounded-lg border px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium">OG Image (URL)</label>
                <input name="ogImage" className="mt-1 w-full rounded-lg border px-3 py-2" />
              </div>

              <div className="flex items-center gap-6">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" name="noindex" value="1" className="h-4 w-4" />
                  <span>Noindex</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" name="nofollow" value="1" className="h-4 w-4" />
                  <span>Nofollow</span>
                </label>
              </div>
            </div>
          </div>

          <button className="w-full rounded-xl bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
            Đăng bài
          </button>
        </aside>
      </form>
    </div>
  );
}
