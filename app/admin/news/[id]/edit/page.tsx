import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updatePost } from "@/app/admin/news/actions";
import ImageField from "@/components/ImageField";
import NewsEditor from "@/components/NewsEditor";
import PostEditInline from "@/components/PostEditInline";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;

  const postId = Number(id);

  if (!Number.isFinite(postId)) {
    notFound();
  }

  const [post, cats] = await Promise.all([
    prisma.post.findUnique({
      where: { id: postId },
    }),

    prisma.postCategory.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
      },
    }),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <>
      <PostEditInline />

      <div className="space-y-5">

        <div className="flex items-center justify-between">

          <h1 className="text-2xl font-semibold">
            Chỉnh sửa bài viết
          </h1>

          <Link
            href="/admin/news"
            className="rounded bg-gray-100 px-3 py-2 hover:bg-gray-200"
          >
            ← Quay lại
          </Link>

        </div>

        <form
          action={updatePost}
          className="grid gap-6 md:grid-cols-3"
        >

          <input
            type="hidden"
            name="id"
            value={post.id}
          />

          <section className="space-y-6 md:col-span-2">

            <div className="rounded-2xl border bg-white shadow-sm">

              <div className="border-b px-5 py-3 font-medium">
                Thông tin cơ bản
              </div>

              <div className="grid gap-4 p-5 md:grid-cols-2">

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium">
                    Tiêu đề *
                  </label>

                  <input
                    name="title"
                    required
                    defaultValue={post.title}
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">
                    Slug
                  </label>

                  <input
                    name="slug"
                    defaultValue={post.slug}
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">
                    Chuyên mục
                  </label>

                  <select
                    name="categoryId"
                    defaultValue={post.categoryId ?? ""}
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                  >
                    <option value="">
                      — Chưa chọn —
                    </option>

                    {cats.map((c) => (
                      <option
                        key={c.id}
                        value={c.id}
                      >
                        {c.name}
                      </option>
                    ))}
                  </select>

                </div>
                                <div className="md:col-span-2">
                  <label className="block text-sm font-medium">
                    Mô tả ngắn (excerpt)
                  </label>

                  <textarea
                    name="excerpt"
                    rows={3}
                    defaultValue={post.excerpt ?? ""}
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                  />
                </div>

                <div className="md:col-span-2">
                  <ImageField
                    name="coverImage"
                    label="Ảnh đại diện"
                    folder="mcbrother/posts"
                    placeholder="Dán URL ảnh hoặc Upload"
                    defaultValue={post.coverImage ?? ""}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium">
                    Tags
                  </label>

                  <input
                    name="tags"
                    defaultValue={post.tags.join(", ")}
                    placeholder="máy đóng gói, máy hút chân không..."
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                  />
                </div>

                <div className="flex items-center gap-6 md:col-span-2">

                  <label className="inline-flex items-center gap-2">

                    <input
                      type="checkbox"
                      name="published"
                      value="1"
                      defaultChecked={post.published}
                      className="h-4 w-4"
                    />

                    <span>Hiển thị bài viết</span>

                  </label>

                </div>

              </div>

            </div>

            <div className="rounded-2xl border bg-white shadow-sm">

              <div className="border-b px-5 py-3 font-medium">
                Nội dung bài viết
              </div>

              <div className="p-5">

                <NewsEditor
                  name="content"
                  value={post.content ?? ""}
                  height={520}
                />

              </div>

            </div>

          </section>

          <aside className="space-y-6">

            <div className="rounded-2xl border bg-white shadow-sm">

              <div className="border-b px-5 py-3 font-medium">
                SEO
              </div>

              <div className="space-y-4 p-5">

                <div>

                  <label className="block text-sm font-medium">
                    Meta title
                  </label>

                  <input
                    name="metaTitle"
                    defaultValue={post.metaTitle ?? ""}
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                  />

                </div>

                <div>

                  <label className="block text-sm font-medium">
                    Meta description
                  </label>

                  <textarea
                    rows={4}
                    name="metaDescription"
                    defaultValue={post.metaDescription ?? ""}
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                  />

                </div>
                                <div>

                  <label className="block text-sm font-medium">
                    Canonical URL
                  </label>

                  <input
                    name="canonicalUrl"
                    defaultValue={post.canonicalUrl ?? ""}
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                  />

                </div>

                <div>

                  <label className="block text-sm font-medium">
                    OG Image
                  </label>

                  <input
                    name="ogImage"
                    defaultValue={post.ogImage ?? ""}
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                  />

                </div>

                <div className="flex flex-col gap-3">

                  <label className="inline-flex items-center gap-2">

                    <input
                      type="checkbox"
                      name="noindex"
                      value="1"
                      defaultChecked={post.noindex}
                      className="h-4 w-4"
                    />

                    <span>Noindex</span>

                  </label>

                  <label className="inline-flex items-center gap-2">

                    <input
                      type="checkbox"
                      name="nofollow"
                      value="1"
                      defaultChecked={post.nofollow}
                      className="h-4 w-4"
                    />

                    <span>Nofollow</span>

                  </label>

                </div>

                <div className="border-t pt-5">

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700"
                  >
                    💾 Lưu thay đổi
                  </button>

                </div>

                <div className="rounded-xl border bg-gray-50 p-4 text-sm space-y-2">

                  <div className="flex justify-between">
                    <span className="text-gray-500">ID</span>
                    <span>{post.id}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">Ngày tạo</span>

                    <span>
                      {post.createdAt.toLocaleDateString("vi-VN")}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Cập nhật
                    </span>

                    <span>
                      {post.updatedAt.toLocaleDateString("vi-VN")}
                    </span>
                  </div>

                </div>

              </div>

            </div>

          </aside>

        </form>

      </div>
          </>
  );
}