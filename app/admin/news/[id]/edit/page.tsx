// app/admin/news/[id]/edit/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { updatePost } from "../../actions";
import ImageField from "@/components/ImageField";
import RichEditor from "@/components/RichEditor";
import Script from "next/script";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pid = Number(id);

  if (!Number.isFinite(pid)) {
    return (
      <div className="mx-auto max-w-6xl px-3 md:px-6 space-y-4">
        <h1 className="text-2xl font-semibold">ID không hợp lệ</h1>
        <p className="text-gray-600">Giá trị id nhận được: "{id}"</p>
        <Link href="/admin/news" className="text-sky-600 hover:underline">
          ← Quay lại danh sách
        </Link>
      </div>
    );
  }

  const [post, cats] = await Promise.all([
    prisma.post.findUnique({
      where: { id: pid },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        coverImage: true,
        tags: true,
        published: true,
        categoryId: true,
        metaTitle: true,
        metaDescription: true,
        canonicalUrl: true,
        ogImage: true,
        noindex: true,
        nofollow: true,
      },
    }),
    prisma.postCategory.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!post) {
    return (
      <div className="mx-auto max-w-6xl px-3 md:px-6 space-y-4">
        <h1 className="text-2xl font-semibold">Không tìm thấy bài viết</h1>
        <p className="text-gray-600">ID bạn đang mở: {pid}</p>
        <Link href="/admin/news" className="text-sky-600 hover:underline">
          ← Quay lại danh sách
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-3 md:px-6 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Sửa bài viết</h1>
        <Link
          href="/admin/news"
          className="rounded bg-gray-100 px-3 py-2 hover:bg-gray-200"
        >
          ← Quay lại
        </Link>
      </div>

      <form
        id="postForm"
        action={updatePost}
        className="grid gap-6 md:grid-cols-3"
      >
        <input type="hidden" name="id" value={post.id} />

        {/* Cột trái */}
        <section className="md:col-span-2 space-y-6">
          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-5 py-3 font-medium">Thông tin cơ bản</div>
            <div className="grid gap-4 p-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium">Tiêu đề *</label>
                <input
                  id="title"
                  name="title"
                  required
                  defaultValue={post.title}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Slug</label>
                <input
                  id="slug"
                  name="slug"
                  defaultValue={post.slug ?? ""}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
                <p id="slugHint" className="mt-1 text-xs text-gray-500"></p>
              </div>
              <div>
                <label className="block text-sm font-medium">Chuyên mục</label>
                <select
                  name="categoryId"
                  defaultValue={post.categoryId ?? ""}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                >
                  <option value="">— Chưa chọn —</option>
                  {cats.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium">
                  Mô tả ngắn (excerpt)
                </label>
                <input
                  name="excerpt"
                  defaultValue={post.excerpt ?? ""}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
              </div>

              <div className="md:col-span-2">
                <ImageField
                  name="coverImage"
                  label="Ảnh đại diện"
                  defaultValue={post.coverImage ?? ""}
                  folder="mcbrother/posts"
                  placeholder="Dán URL ảnh hoặc bấm Upload"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium">
                  Tags (phân tách bằng dấu phẩy)
                </label>
                <input
                  id="tagsInput"
                  name="tags"
                  defaultValue={(post.tags || []).join(", ")}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
                <p className="text-xs text-gray-500">
                  Ví dụ: máy đóng gói, công nghệ thực phẩm, mcbrother
                </p>
                <div id="tagsPreview" className="mt-2 flex flex-wrap gap-2"></div>
              </div>

              <div className="flex items-center gap-6 md:col-span-2">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="published"
                    value="1"
                    defaultChecked={!!post.published}
                    className="h-4 w-4"
                  />
                  <span>Hiển thị</span>
                </label>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-5 py-3 font-medium">Nội dung</div>
            <div className="p-5">
              <RichEditor name="content" value={post.content ?? ""} />
            </div>
          </div>
        </section>

        {/* Cột phải */}
        <aside className="space-y-6">
          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-5 py-3 font-medium">SEO</div>
            <div className="space-y-4 p-5">
              <div>
                <label className="block text-sm font-medium">Meta title</label>
                <input
                  id="metaTitle"
                  name="metaTitle"
                  defaultValue={post.metaTitle ?? ""}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
                <p id="metaTitleCount" className="mt-1 text-xs text-gray-500"></p>
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Meta description
                </label>
                <textarea
                  id="metaDescription"
                  name="metaDescription"
                  rows={3}
                  defaultValue={post.metaDescription ?? ""}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
                <p id="metaDescCount" className="mt-1 text-xs text-gray-500"></p>
              </div>
              <div>
                <label className="block text-sm font-medium">Canonical URL</label>
                <input
                  name="canonicalUrl"
                  defaultValue={post.canonicalUrl ?? ""}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  OG Image (URL)
                </label>
                <input
                  name="ogImage"
                  defaultValue={post.ogImage ?? ""}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="noindex"
                    value="1"
                    defaultChecked={!!post.noindex}
                    className="h-4 w-4"
                  />
                  <span>Noindex</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="nofollow"
                    value="1"
                    defaultChecked={!!post.nofollow}
                    className="h-4 w-4"
                  />
                  <span>Nofollow</span>
                </label>
              </div>
            </div>
          </div>

          <button
            id="submitBtn"
            className="hidden md:block w-full rounded-xl bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            Lưu thay đổi
          </button>
        </aside>
      </form>

      {/* Sticky save button for mobile */}
      <div className="md:hidden sticky bottom-3 z-40">
        <button
          form="postForm"
          className="w-full rounded-xl bg-blue-600 px-4 py-3 font-medium text-white shadow-lg"
        >
          Lưu thay đổi
        </button>
      </div>

      {/* Helpers: auto-slug + count SEO + preview tags */}
      <Script id="post-edit-helpers" strategy="afterInteractive">{`
        (function(){
          const $ = (s)=>document.querySelector(s);
          const title=$('#title'), slug=$('#slug'), slugHint=$('#slugHint');
          const mt=$('#metaTitle'), md=$('#metaDescription');
          const mtc=$('#metaTitleCount'), mdc=$('#metaDescCount');
          const tagsInp=$('#tagsInput'), tagsWrap=$('#tagsPreview');

          const toSlug=(s)=>s.toLowerCase().normalize('NFKD').replace(/[\\u0300-\\u036f]/g,'').replace(/[^a-z0-9\\s-]/g,'').trim().replace(/[\\s_-]+/g,'-').replace(/^-+|-+$/g,'');
          let last=slug?.value||'';
          function sync(){ if(!title||!slug) return; const base=toSlug(title.value||''); if(slug.value===''||slug.value===last){ slug.value=base; last=base; if(slugHint) slugHint.textContent=base?('Slug gợi ý: '+base):''; } }
          title?.addEventListener('input', sync);

          function paintCount(el,val,min,max){ const len=val.length; const ok=len>=min&&len<=max; el.textContent=len+' ký tự'+(ok?' (tốt)':''); el.style.color= ok? '#16a34a':'#6b7280'; }
          function tick(){ if(mt&&mtc) paintCount(mtc, mt.value, 50, 60); if(md&&mdc) paintCount(mdc, md.value, 140, 160); }
          mt?.addEventListener('input', tick); md?.addEventListener('input', tick); tick();

          function renderTags(){
            if(!tagsInp||!tagsWrap) return;
            const parts=(tagsInp.value||'').split(',').map(s=>s.trim()).filter(Boolean);
            tagsWrap.innerHTML='';
            parts.forEach(t=>{
              const span=document.createElement('span');
              span.className='inline-flex items-center rounded-full border px-2 py-0.5 text-xs';
              span.textContent=t;
              tagsWrap.appendChild(span);
            });
          }
          tagsInp?.addEventListener('input', renderTags);
          renderTags();
        })();
      `}</Script>
    </div>
  );
}
