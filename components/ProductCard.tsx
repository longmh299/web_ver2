import Link from "next/link";

export type ProductCardData = {
  id: number;
  slug: string;
  name: string;
  price: number | null;
  coverImage: string | null;
  short: string | null;
  category?: { id: number; name: string } | null;
};

function fmtVND(n?: number | null) {
  if (typeof n !== "number" || !Number.isFinite(n)) return "";
  return new Intl.NumberFormat("vi-VN").format(n);
}

function cldThumb(url: string | null, w = 600, h = 600) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (
      u.hostname.includes("res.cloudinary.com") &&
      u.pathname.includes("/upload/")
    ) {
      return url.replace(
        "/upload/",
        `/upload/c_fill,g_auto:subject,f_auto,q_auto,dpr_auto,w_${w},h_${h}/`
      );
    }
  } catch {}
  return url;
}

export default function ProductCard({ p }: { p: ProductCardData }) {
  const hasPrice = typeof p.price === "number" && Number.isFinite(p.price);
  const imgUrl = cldThumb(p.coverImage, 600, 600);

  const features =
    p.short?.split("\n").filter(Boolean).slice(0, 2) || [];

  return (
    <article className="group flex flex-col h-full bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-[3px] hover:border-[var(--color-accent)]">

      <Link href={`/san-pham/${p.slug}`} className="flex flex-col h-full">

        {/* ===== IMAGE (60%) ===== */}
        <div className="relative h-[60%] min-h-[180px] bg-white flex items-center justify-center overflow-hidden">
          {imgUrl ? (
            <img
              src={imgUrl}
              alt={p.name}
              loading="lazy"
              className="max-h-full max-w-full object-contain transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="text-sm text-gray-400">No image</div>
          )}
        </div>

        {/* ===== CONTENT (40%) ===== */}
<div className="flex flex-col flex-1 p-4">

  {/* CATEGORY */}
  {p.category && (
    <div className="text-[12px] text-gray-500 mb-1 uppercase tracking-wide">
      {p.category.name}
    </div>
  )}

  {/* TITLE (TO HƠN + ĐẬM HƠN) */}
  <h2 className="text-[16px] font-semibold leading-snug text-[var(--color-accent)] line-clamp-2 min-h-[44px]">
    {p.name}
  </h2>

  {/* FEATURES */}
  <div className="mt-2 min-h-[44px]">
    {features.length > 0 && (
      <ul className="text-[14px] text-gray-700 space-y-1">
        {features.map((f, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-green-500 text-sm">✔</span>
            <span className="line-clamp-1">{f}</span>
          </li>
        ))}
      </ul>
    )}
  </div>

  {/* PRICE */}
  <div className="mt-2 text-[14px] font-semibold text-red-500">
    Giá: {hasPrice ? `${fmtVND(p.price)} ₫` : "Liên hệ"}
  </div>

  {/* CTA */}
  <div className="mt-auto pt-3">
    <div className="w-full text-center py-2.5 rounded bg-[var(--color-secondary)] text-white text-[14px] font-semibold transition group-hover:bg-opacity-90">
      Nhận báo giá
    </div>
  </div>

</div>
      </Link>
    </article>
  );
}