// app/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import TickerBar from "@/components/TickerBar";
import FeaturedSlider from "@/components/FeaturedSlider";

import { cache } from "react";
import { PhoneCall, Settings, TrendingUp, Truck, Zap } from "lucide-react";

export const revalidate = 60;
export const runtime = "nodejs";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mcbrother.net";

export const metadata: Metadata = {
  title: "MCBROTHER JSC – Máy chế biến & đóng gói thực phẩm",
  description:
    "Giải pháp máy móc tối ưu hiệu suất cho nhà máy/xưởng: hút chân không, co màng, in date, cân đóng gói… Lắp đặt & bảo hành tận nơi.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "MCBROTHER JSC",
    title: "MCBROTHER JSC – Máy chế biến & đóng gói thực phẩm",
    description: "Giải pháp theo nhu cầu – lắp đặt nhanh – bảo hành tận nơi.",
  },
  robots: { index: true, follow: true },
};

function fmtVND(n?: number | null) {
  if (typeof n !== "number") return "Liên hệ";
  try {
    return new Intl.NumberFormat("vi-VN").format(n) + "₫";
  } catch {
    return "Liên hệ";
  }
}

/* ================= DATA ================= */

// 🔥 cache toàn bộ homepage
const getHomepageData = cache(async () => {
  const [
    featured,
    categoriesHome,
    categories,
    posts,
  ] = await Promise.all([

    prisma.product.findMany({
      where: { published: true, isFeatured: true },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        slug: true,
        name: true,
        short: true,
        coverImage: true,
        price: true,
      },
    }),

    prisma.category.findMany({
      where: { isFeatured: true },
      orderBy: { order: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        banner: true,
        ogImage: true,
        metaDescription: true,
      },
    }),

    prisma.category.findMany({
      where: { parentId: null },
      orderBy: { order: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        children: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    }),

    prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        id: true,
        title: true,
        slug: true,
        coverImage: true,
        excerpt: true,
        createdAt: true,
        category: {
          select: { name: true },
        },
      },
    }),
  ]);

  // 🔥 fallback nếu không có featured
  let products = featured;

  if (featured.length === 0) {
    products = await prisma.product.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        slug: true,
        name: true,
        short: true,
        coverImage: true,
        price: true,
      },
    });
  }

  return {
    products,
    categories,
    categoriesHome,
    posts,
  };
});

export default async function HomePage() {
  const { products, categories, categoriesHome, posts } = await getHomepageData();
  return (
    <main className="bg-[var(--color-bg)] text-slate-800">
      {/* hero */}
      <section className="relative h-[520px] flex items-center overflow-hidden">

        {/* BACKGROUND */}
        <div
          className="absolute inset-0 bg-no-repeat"
          style={{
            backgroundImage: "url('https://res.cloudinary.com/ds55hfvx4/image/upload/v1774489339/hero_banner_u2ziwq.png')",
            backgroundSize: "cover",              // ✅ QUAN TRỌNG
            backgroundPosition: "right bottom",   // ✅ GIỮ MÁY BÊN PHẢI
          }}
        />

        {/* OVERLAY NHẸ (optional) */}
        <div className="absolute inset-0 bg-gradient-to-r 
          from-white/90 
          via-white/70 
          to-transparent" />

        {/* CONTENT */}
        <div className="relative max-w-7xl mx-auto w-full px-4">
          <div className="max-w-xl">

            <h1 className="text-4xl font-bold text-gray-800 leading-snug">
              Máy đóng gói & thiết bị chế biến thực phẩm công nghiệp tại TP.HCM
            </h1>

            <p className="mt-4 text-gray-600">
              MCBROTHER chuyên cung cấp máy đóng gói, máy chiết rót và dây chuyền sản xuất thực phẩm chất lượng cao.
            </p>

            <button className="mt-6 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-6 py-3 rounded-lg transition">
              Nhận báo giá ngay
            </button>

          </div>
        </div>

      </section>

      <section className="py-14">
        <div className="max-w-7xl xl:max-w-[1280px] mx-auto px-4">

          {/* TITLE */}
          <h2 className="text-[20px] font-semibold text-center mb-2">
            Thiết bị & máy móc ngành thực phẩm
          </h2>

          {/* SUBTEXT (AI rất cần) */}
          <p className="text-center text-sm text-gray-600 max-w-2xl mx-auto mb-8">
            MCBROTHER cung cấp các dòng máy đóng gói, máy chiết rót và thiết bị chế biến
            giúp doanh nghiệp tối ưu quy trình sản xuất và nâng cao hiệu suất vận hành.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {categoriesHome.map((cat) => (
              <div
                key={cat.id}
                className="group bg-white border border-gray-200 rounded overflow-hidden transition duration-300 hover:shadow-md hover:-translate-y-1"
              >
                {/* IMAGE */}
                <div className="relative h-56 bg-gray-200 overflow-hidden">
                  <img
                    src={cat.ogImage || cat.banner || "/images/no-image.png"}
                    alt={`${cat.name} MCBROTHER`}
                    className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
                </div>

                {/* CONTENT */}
                <div className="p-6">
                  <h3 className="text-[var(--color-primary)] font-semibold text-base mb-1">
                    {cat.name}
                  </h3>

                  <p className="text-sm text-gray-600 leading-snug line-clamp-2">
                    {cat.metaDescription ||
                      `MCBROTHER cung cấp ${cat.name.toLowerCase()} cho ngành thực phẩm, 
                giúp tối ưu quy trình sản xuất và nâng cao năng suất.`}
                  </p>

                  <Link href={`/${cat.slug}`}>
                    <button className="mt-4 w-full bg-[var(--color-primary)] text-white py-2 text-base font-semibold transition hover:bg-[var(--color-primary-dark)]">
                      Xem chi tiết →
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="bg-white border-y border-gray-200">
        <div className="max-w-7xl xl:max-w-[1280px] mx-auto px-4">
          <FeaturedSlider
            items={products}
            title="Sản phẩm nổi bật"
          />
        </div>
      </section>

      {/* <section className="py-12 bg-gray-50 text-center">
  <p className="text-lg italic text-gray-700 max-w-2xl mx-auto">
    “Giải pháp phù hợp cho doanh nghiệp sản xuất – dễ triển khai và tối ưu hiệu suất.”
  </p>
</section> */}

      {/* ===== SOLUTION ===== */}
      <div className="bg-gradient-to-r from-[#1fa2a6] to-[#2bb3b8] text-white py-14">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">

          {/* LEFT */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Giải pháp trọn gói cho nhà máy của bạn
            </h2>

            <p className="text-white/90 mb-6">
              Tư vấn – thiết kế – lắp đặt dây chuyền sản xuất phù hợp với nhu cầu thực tế
            </p>

            <ul className="space-y-3 text-sm">

              <li className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-yellow-300" />
                Thiết kế theo yêu cầu
              </li>

              <li className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-yellow-300" />
                Lắp đặt tận nơi
              </li>

              <li className="flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-yellow-300" />
                Tư vấn miễn phí 24/7
              </li>

            </ul>

            {/* BUTTON */}
            <div className="mt-6 flex gap-3">
              <a
                href="/lien-he"
                className="px-6 py-3 rounded-lg bg-white text-[var(--color-primary)] font-semibold hover:bg-gray-100 transition"
              >
                Nhận báo giá
              </a>

              <a
                href="tel:0900000000"
                className="px-6 py-3 rounded-lg border border-white/50 hover:bg-white/10 transition"
              >
                Gọi ngay
              </a>
            </div>
          </div>

          {/* RIGHT (optional image) */}
          <div className="hidden md:block relative">

            {/* glow nền */}
            <div className="absolute -inset-4 bg-white/10 rounded-2xl blur-2xl"></div>

            {/* image */}
            <img
              src="https://res.cloudinary.com/ds55hfvx4/image/upload/v1774664686/banner2_en4elx.jpg"
              alt="solution"
              className="relative z-10 w-full max-h-[260px] object-cover 
    rounded-2xl shadow-xl"
            />

          </div>

        </div>
      </div>

      {/* ===== BLOG ===== */}
      <section className="py-14">
        <div className="max-w-7xl xl:max-w-[1280px] mx-auto px-4">
          <h2 className="text-[20px] font-semibold text-center mb-8">
            Tin tức & kiến thức
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white border border-gray-200 hover:border-gray-300 transition"
              >
                {/* IMAGE */}
                <div className="h-40 bg-gray-200">
                  <img
                    src={post.coverImage || "/no-image.png"}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* CONTENT */}
                <div className="p-6">
                  {/* CATEGORY + DATE */}
                  <div className="text-xs text-gray-400 mb-1">
                    {post.category?.name || "Tin tức"} •{" "}
                    {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                  </div>

                  {/* TITLE */}
                  <h3 className="text-[var(--color-primary)] text-base font-semibold line-clamp-2">
                    {post.title}
                  </h3>

                  {/* EXCERPT */}
                  <p className="text-sm leading-relaxed text-gray-600 mt-1 line-clamp-2">
                    {post.excerpt || "Đang cập nhật nội dung..."}
                  </p>

                  {/* LINK */}
                  <Link href={`/tin-tuc/${post.slug}`}>
                    <div className="mt-3 text-base font-semibold text-[var(--color-primary)]">
                      Xem chi tiết →
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="bg-[var(--color-primary)] text-white text-center py-14">
        <h3 className="text-[22px] font-semibold">
          Cần tư vấn giải pháp phù hợp?
        </h3>

        <button className="mt-4 bg-white text-black px-6 py-2 rounded text-base font-semibold font-medium">
          Liên hệ ngay
        </button>
      </section>

    </main>
  );
}

