// app/admin/products/[id]/edit/page.tsx
import { prisma } from "@/lib/prisma";
import { updateProduct } from "../../actions";
import Link from "next/link";
import { notFound } from "next/navigation";
import RichEditor from "@/components/RichEditor";
import Script from "next/script";
import ImageField from "@/components/ImageField";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  // ✅ Next 15: params là Promise
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!Number.isFinite(id)) notFound();

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        slug: true,
        name: true,
        short: true,
        description: true,
        sku: true,
        price: true,
        coverImage: true,
        videoUrl: true,
        published: true,
        isFeatured: true,
        power: true,
        voltage: true,
        weight: true,
        dimensions: true,
        functions: true,
        material: true,
        metaTitle: true,
        metaDescription: true,
        canonicalUrl: true,
        ogImage: true,
        noindex: true,
        nofollow: true,
        categoryId: true,
        specTable: true,
        faqs: true,
      },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!product) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Không tìm thấy sản phẩm</h1>
        <Link
          href="/admin/products"
          className="text-sky-600 hover:underline"
        >
          ← Quay lại danh sách
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Sửa sản phẩm</h1>
        <Link
          href="/admin/products"
          className="px-3 py-2 text-[15px] rounded bg-gray-100 hover:bg-gray-200"
        >
          ← Quay lại
        </Link>
      </div>

      <form
        id="productForm"
        action={updateProduct}
        className="grid gap-6 md:grid-cols-3"
      >
        <input type="hidden" name="id" value={product.id} />

        {/* Cột trái: Thông tin cơ bản */}
        <section className="md:col-span-2 space-y-6">
          {/* Card 1: Thông tin chung */}
          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-5 py-3 font-medium">Thông tin chung</div>
            <div className="p-5 grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium">Tên sản phẩm *</label>
                <input
                  id="name"
                  name="name"
                  required
                  defaultValue={product.name}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Slug</label>
                <input
                  id="slug"
                  name="slug"
                  defaultValue={product.slug ?? ""}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                  placeholder="may-ghep-mi-lon-tdfj-160"
                  pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
                  title="Chỉ chữ thường, số và dấu gạch ngang"
                />
                <p id="slugHint" className="mt-1 text-xs text-gray-500"></p>
              </div>

              <div>
                <label className="block text-sm font-medium">SKU</label>
                <input
                  name="sku"
                  defaultValue={product.sku ?? ""}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Giá</label>
                <input
                  name="price"
                  type="number"
                  step="1"
                  min="0"
                  defaultValue={
                    typeof product.price === "number" ? product.price : undefined
                  }
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                  placeholder="VD: 125000000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Danh mục</label>
                <select
                  name="categoryId"
                  defaultValue={product.categoryId ?? ""}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                >
                  <option value="">-- Chưa chọn --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium">Mô tả ngắn</label>
                <textarea
                  name="short"
                  defaultValue={product.short ?? ""}
                  rows={3}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                  placeholder="Mỗi dòng 1 thông tin..."
                />
              </div>

              {/* Ảnh đại diện */}
              <div className="md:col-span-2">
                <ImageField
                  name="coverImage"
                  label="Ảnh đại diện"
                  defaultValue={product.coverImage ?? ""}
                  folder="mcbrother/products"
                  placeholder="Dán URL ảnh hoặc bấm Upload"
                />
              </div>

              {/* Video */}
              <div className="space-y-1 md:col-span-2">
                <label className="block text-sm font-medium">
                  Link video (YouTube/Cloudinary)
                </label>
                <input
                  id="videoUrl"
                  name="videoUrl"
                  type="url"
                  className="w-full rounded-md border px-3 py-2"
                  placeholder="https://www.youtube.com/watch?v=..."
                  defaultValue={product.videoUrl ?? ""}
                />
                <p className="text-xs text-muted-foreground">
                  Dán link YouTube (tự chuyển sang /embed) hoặc link video
                  Cloudinary/MP4.
                </p>
                <div id="videoPreviewWrap" className="mt-2 hidden">
                  <div className="text-xs text-gray-600 mb-2">Xem trước video:</div>
                  <div className="rounded-lg border bg-black/5 p-2">
                    <div className="aspect-video w-full">
                      <iframe
                        id="ytPreview"
                        className="hidden h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                      <video id="mp4Preview" className="hidden h-full w-full" controls />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 md:col-span-2">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="published"
                    defaultChecked={!!product.published}
                    className="h-4 w-4"
                  />
                  <span>Hiển thị</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    defaultChecked={!!product.isFeatured}
                    className="h-4 w-4"
                  />
                  <span>Nổi bật</span>
                </label>
              </div>
            </div>
          </div>

          {/* Card 2: Nội dung (Rich text / HTML) */}
          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-5 py-3 font-medium">Nội dung chi tiết</div>
            <div className="p-5">
              <RichEditor name="description" value={product.description ?? ""} />
            </div>
          </div>

          {/* Card 3: Thông số kỹ thuật */}
          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-5 py-3 font-medium">Thông số kỹ thuật</div>
            <div className="p-5 grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium">Công suất (power)</label>
                <input
                  name="power"
                  defaultValue={product.power ?? ""}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Điện áp (voltage)</label>
                <input
                  name="voltage"
                  defaultValue={product.voltage ?? ""}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Cân nặng (weight)</label>
                <input
                  name="weight"
                  defaultValue={product.weight ?? ""}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Kích thước (dimensions)</label>
                <input
                  name="dimensions"
                  defaultValue={product.dimensions ?? ""}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Chức năng (functions)</label>
                <input
                  name="functions"
                  defaultValue={product.functions ?? ""}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Vật liệu (material)</label>
                <input
                  name="material"
                  defaultValue={product.material ?? ""}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
              </div>
            </div>
          </div>
          {/* Card 4: Bảng thông số nâng cao */}
          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-5 py-3 font-medium">
              Bảng thông số nâng cao
            </div>

            <div className="p-5 space-y-4">
              <div id="specColumnsWrap" className="space-y-2">
                Thêm mã máy
              </div>

              <button
                type="button"
                id="addColumnBtn"
                className="text-sm text-blue-600"
              >
                + Thêm model
              </button>

              <div id="specRowsWrap" className="space-y-3">
                Thông số máy
              </div>

              <button
                type="button"
                id="addRowBtn"
                className="text-sm text-blue-600"
              >
                + Thêm dòng
              </button>

              {/* 🔥 FIX KEY */}
              <input
  key={`spec-${product.id}`}
  type="hidden"
  id="specTableInput"
  name="specTable"
  value={JSON.stringify(product.specTable ?? null)}
/>
            </div>
          </div>

          {/* Card 5: FAQ */}
          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-5 py-3 font-medium">
              FAQ sản phẩm
            </div>

            <div className="p-5 space-y-4">
              <div id="faqWrap" className="space-y-3"></div>

              <button
                type="button"
                id="addFaqBtn"
                className="text-sm text-blue-600"
              >
                + Thêm câu hỏi
              </button>

              {/* 🔥 FIX KEY */}
             <input
  key={`faq-${product.id}`}
  type="hidden"
  id="faqInput"
  name="faqs"
  value={JSON.stringify(product.faqs ?? [])}
/>
            </div>
          </div>
        </section>

        {/* Cột phải: SEO */}
        <aside className="space-y-6">
          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-5 py-3 font-medium">SEO</div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium">Meta title</label>
                <input
                  id="metaTitle"
                  name="metaTitle"
                  defaultValue={product.metaTitle ?? ""}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
                <p id="metaTitleCount" className="mt-1 text-xs text-gray-500"></p>
              </div>
              <div>
                <label className="block text-sm font-medium">Meta description</label>
                <textarea
                  id="metaDescription"
                  name="metaDescription"
                  rows={3}
                  defaultValue={product.metaDescription ?? ""}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
                <p id="metaDescCount" className="mt-1 text-xs text-gray-500"></p>
              </div>
              <div>
                <label className="block text-sm font-medium">Canonical URL</label>
                <input
                  name="canonicalUrl"
                  defaultValue={product.canonicalUrl ?? ""}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">OG Image (URL)</label>
                <input
                  name="ogImage"
                  defaultValue={product.ogImage ?? ""}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="noindex"
                    defaultChecked={!!product.noindex}
                    className="h-4 w-4"
                  />
                  <span>Noindex</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="nofollow"
                    defaultChecked={!!product.nofollow}
                    className="h-4 w-4"
                  />
                  <span>Nofollow</span>
                </label>
              </div>
            </div>
          </div>

          <button
            id="submitBtn"
            className="w-full rounded-xl bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            Lưu thay đổi
          </button>
        </aside>
      </form>

      {/* ---------- Client-side helpers ---------- */}
      <Script id="product-edit-enhance" strategy="afterInteractive">{`
(function(){
  const $ = (sel)=>document.querySelector(sel);
  const nameEl = $('#name');
  const slugEl = $('#slug');
  const slugHint = $('#slugHint');
  const videoInput = $('#videoUrl');
  const videoWrap = $('#videoPreviewWrap');
  const ytPreview = $('#ytPreview');
  const mp4Preview = $('#mp4Preview');
  const form = $('#productForm');
  const submitBtn = $('#submitBtn');
  const metaTitle = $('#metaTitle');
  const metaDescription = $('#metaDescription');
  const metaTitleCount = $('#metaTitleCount');
  const metaDescCount = $('#metaDescCount');

  const specColumnsWrap = document.getElementById('specColumnsWrap');
  const specRowsWrap = document.getElementById('specRowsWrap');
  const specTableInput = document.getElementById('specTableInput');

  const faqWrap = document.getElementById('faqWrap');
  const faqInput = document.getElementById('faqInput');

  let dirty = false;
  const markDirty = function(){ dirty = true; };

  // ===== Auto slug =====
  const toSlug = function(s){
    return s
      .toLowerCase()
      .normalize('NFKD').replace(/[\\u0300-\\u036f]/g,'')
      .replace(/[^a-z0-9\\s-]/g,'')
      .trim()
      .replace(/[\\s_-]+/g,'-')
      .replace(/^-+|-+$/g,'');
  };

  let lastAutoSlug = slugEl?.value || '';

  const syncSlug = function(){
    if (!nameEl || !slugEl) return;
    const base = toSlug(nameEl.value || '');
    if (slugEl.value === '' || slugEl.value === lastAutoSlug) {
      slugEl.value = base;
      lastAutoSlug = base;
      if (slugHint) slugHint.textContent = base ? 'Slug gợi ý: ' + base : '';
    }
  };

  if (nameEl) nameEl.addEventListener('input', function(){ syncSlug(); markDirty(); });
  if (slugEl) slugEl.addEventListener('input', markDirty);

  // ===== VIDEO =====
  const toYouTubeEmbed = function(u){
    try {
      const url = new URL(u);
      if (/^(www\\.)?youtube\\.com$/i.test(url.hostname) && url.searchParams.get('v')) {
        return 'https://www.youtube.com/embed/' + url.searchParams.get('v');
      }
      if (/^(youtu\\.be)$/i.test(url.hostname)) {
        return 'https://www.youtube.com/embed/' + url.pathname.replace(/^\\//,'');
      }
    } catch {}
    return null;
  };

  const isVideoFile = function(u){
    return /\\.(mp4|webm|ogg)(\\?.*)?$/i.test(u) || /\\/video\\/upload\\//.test(u);
  };

  const updateVideo = function(){
    if (!videoInput || !videoWrap || !ytPreview || !mp4Preview) return;

    const raw = (videoInput.value || '').trim();
    ytPreview.classList.add('hidden');
    mp4Preview.classList.add('hidden');
    videoWrap.classList.add('hidden');

    if (!raw) return;

    const yt = toYouTubeEmbed(raw);
    if (yt) {
      ytPreview.src = yt;
      ytPreview.classList.remove('hidden');
      videoWrap.classList.remove('hidden');
      return;
    }

    if (isVideoFile(raw)) {
      mp4Preview.src = raw;
      mp4Preview.classList.remove('hidden');
      videoWrap.classList.remove('hidden');
    }
  };

  if (videoInput) {
    videoInput.addEventListener('input', function(){ updateVideo(); markDirty(); });
    updateVideo();
  }

  // ===== SEO =====
  const paintCount = function(el, val, min, max){
    const len = val.length;
    const ok = len>=min && len<=max;
    el.textContent = len + ' ký tự' + (ok ? ' (tốt)' : '');
    el.style.color = ok ? '#16a34a' : '#6b7280';
  };

  const tickSEO = function(){
    if (metaTitle && metaTitleCount) paintCount(metaTitleCount, metaTitle.value, 50, 60);
    if (metaDescription && metaDescCount) paintCount(metaDescCount, metaDescription.value, 140, 160);
  };

  if (metaTitle) metaTitle.addEventListener('input', function(){ tickSEO(); markDirty(); });
  if (metaDescription) metaDescription.addEventListener('input', function(){ tickSEO(); markDirty(); });
  tickSEO();

  // ===== 🔥 FIX PREFILL =====
  function renderSpecAndFaq() {
    try {
      const specData = JSON.parse(specTableInput?.value || 'null');
      const faqData = JSON.parse(faqInput?.value || '[]');

      // clear
      if (specColumnsWrap) specColumnsWrap.innerHTML = '';
      if (specRowsWrap) specRowsWrap.innerHTML = '';
      if (faqWrap) faqWrap.innerHTML = '';

      // spec
      if (specData) {
        specData.columns?.forEach(function(col){
          const input = document.createElement('input');
          input.value = col;
          input.className = 'w-full border px-3 py-2 rounded';
          specColumnsWrap?.appendChild(input);
        });

        specData.rows?.forEach(function(row){
          const rowDiv = document.createElement('div');
          rowDiv.className = 'space-y-2';

          const label = document.createElement('input');
          label.value = row.label;
          label.className = 'border px-2 py-1 rounded w-full';

          const valuesWrap = document.createElement('div');
          valuesWrap.className = 'flex gap-2 flex-wrap';

          row.values?.forEach(function(v){
            const val = document.createElement('input');
            val.value = v;
            val.className = 'border px-2 py-1 rounded';
            valuesWrap.appendChild(val);
          });

          rowDiv.appendChild(label);
          rowDiv.appendChild(valuesWrap);

          specRowsWrap?.appendChild(rowDiv);
        });
      }

      // faq
      faqData.forEach(function(f){
        const div = document.createElement('div');
        div.className = 'space-y-1';

        div.innerHTML =
          '<input value="'+(f.question || '')+'" class="w-full border px-3 py-2 rounded"/>' +
          '<input value="'+(f.answer || '')+'" class="w-full border px-3 py-2 rounded"/>';

        faqWrap?.appendChild(div);
      });

    } catch (e) {
      console.log("Render error:", e);
    }
  }

  // ===== INIT =====
  syncSlug();

  // 🔥 chạy lần đầu
  setTimeout(renderSpecAndFaq, 100);

  // 🔥 chạy lại khi quay lại page
  document.addEventListener('visibilitychange', function(){
    if (document.visibilityState === 'visible') {
      renderSpecAndFaq();
    }
  });

})();
`}</Script>
    </div>
  );
}
