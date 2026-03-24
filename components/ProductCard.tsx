
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
    <article className="group flex flex-col h-full bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-[4px] hover:border-[var(--color-accent)]">

      {/* IMAGE */}
      <Link href={`/san-pham/${p.slug}`} className="relative block">
        <div className="relative h-[200px] bg-white flex items-center justify-center overflow-hidden">

          {/* BADGE */}
          {/* <div className="absolute top-2 left-2 bg-[var(--color-accent)] text-white text-[11px] px-2 py-1 rounded">
            Hàng mới
          </div> */}

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
      </Link>

      {/* CONTENT */}
      <div className="flex flex-col flex-1 p-4">

        {/* CATEGORY */}
        {p.category && (
          <div className="text-[11px] text-gray-400 uppercase tracking-wide mb-1">
            {p.category.name}
          </div>
        )}

        {/* TITLE */}
        <Link href={`/san-pham/${p.slug}`}>
          <h2 className="text-[15px] font-semibold leading-snug text-gray-800 line-clamp-2 hover:text-[var(--color-accent)] transition">
            {p.name}
          </h2>
        </Link>

        {/* FEATURES */}
        <div className="mt-2 min-h-[40px]">
          {features.length > 0 && (
            <ul className="text-[13px] text-gray-600 space-y-1">
              {features.map((f, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-green-500 text-xs">✔</span>
                  <span className="line-clamp-1">{f}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* PRICE */}
        <div className="mt-2 text-[14px] font-semibold text-red-500">
          {hasPrice ? `${fmtVND(p.price)} ₫` : "Giá: Liên hệ"}
        </div>

        {/* TRUST */}
        <div className="mt-2 text-[12px] text-gray-500 space-y-1">
          <div>✔ Bảo hành 12 tháng</div>
          <div>✔ Giao hàng toàn quốc</div>
        </div>

        {/* CTA */}
        <div className="mt-auto pt-3 flex gap-2">

          {/* XEM CHI TIẾT */}
          <Link
            href={`/san-pham/${p.slug}`}
            className="flex-1 text-center py-2 rounded border text-[13px] hover:bg-gray-100 transition"
          >
            Xem chi tiết
          </Link>

          {/* ZALO */}
          <a
            href="https://zalo.me/0834551888"
            target="_blank"
            className="flex-1 text-center py-2 rounded bg-[var(--color-accent)] text-white text-[13px] font-semibold hover:opacity-90 transition"
          >
            Báo giá
          </a>

        </div>
      </div>
    </article>
  );
}
