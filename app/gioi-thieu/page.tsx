// app/gioi-thieu/page.tsx
import { Quote } from "lucide-react";
import type { Metadata } from "next";

/* ================= DATA ================= */
const COMPANY = {
  name: "Công ty Cổ phần Thiết bị MCBROTHER",
  slogan:
    "Đồng hành số hoá sản xuất thực phẩm — tối ưu vận hành, nâng tầm chuẩn chất lượng.",
  summary:
    "MCBROTHER JSC là doanh nghiệp tư vấn giải pháp và cung cấp thiết bị cho chuỗi chế biến — đóng gói thực phẩm. Chúng tôi tập trung vào hiệu quả vận hành, an toàn và tính bền vững.",
};

const STATS = [
  { value: "10+", label: "năm kinh nghiệm" },
  { value: "1.200+", label: "khách hàng & đối tác" },
  { value: "250+", label: "dự án triển khai" },
  { value: "24–48h", label: "hỗ trợ kỹ thuật" },
];

const VALUES = [
  {
    title: "Chính trực & Minh bạch",
    desc: "Cam kết rõ ràng về chất lượng, tiến độ và chi phí.",
  },
  {
    title: "Hiệu quả & An toàn",
    desc: "Tối ưu vận hành, đảm bảo an toàn sản xuất.",
  },
  {
    title: "Đồng hành dài hạn",
    desc: "Hỗ trợ từ khảo sát đến bảo trì và nâng cấp.",
  },
  {
    title: "Cải tiến liên tục",
    desc: "Tối ưu dựa trên dữ liệu vận hành thực tế.",
  },
];

const METHODS = [
  { step: "01", title: "Khảo sát", desc: "Đánh giá nhu cầu & hiện trạng." },
  { step: "02", title: "Thiết kế", desc: "Đề xuất giải pháp tối ưu." },
  { step: "03", title: "Triển khai", desc: "Lắp đặt & chạy thử." },
  { step: "04", title: "Đồng hành", desc: "Bảo trì & nâng cấp." },
];

const TESTIMONIALS = [
  {
    name: "Nguyễn Văn Hùng",
    role: "Chủ xưởng chế biến thực phẩm - Bình Dương",
    content:
      "Bên mình đầu tư dây chuyền từ MCBROTHER, máy chạy ổn định, ít lỗi vặt. Sau 3 tháng năng suất tăng rõ rệt.",
    rating: 5,
    avatar: "https://res.cloudinary.com/ds55hfvx4/image/upload/v1774666029/ChatGPT_Image_09_46_18_28_thg_3_2026_kjrgyr.png",
  },
  {
    name: "Trần Minh Tuấn",
    role: "Doanh nghiệp đóng gói - Long An",
    content:
      "Được tư vấn đúng nhu cầu nên không bị dư công suất. Lắp đặt nhanh, kỹ thuật hỗ trợ nhiệt tình.",
    rating: 5,
    avatar: "https://res.cloudinary.com/ds55hfvx4/image/upload/v1774666058/Gemini_Generated_Image_doqexhdoqexhdoqe_qoxdid.png",
  },
  {
    name: "Lê Quốc Bảo",
    role: "Xưởng sản xuất bánh kẹo - Đồng Nai",
    content:
      "Máy vận hành êm, dễ sử dụng. Nhân viên bên mình chỉ cần hướng dẫn 1-2 buổi là chạy được.",
    rating: 4,
    avatar: "https://res.cloudinary.com/ds55hfvx4/image/upload/v1774666254/ChatGPT_Image_09_47_37_28_thg_3_2026_iaeuek.png",
  },
  {
    name: "Phạm Thị Lan",
    role: "Cơ sở chế biến nông sản - Đắk Lắk",
    content:
      "Chi phí hợp lý so với chất lượng. Bên kỹ thuật hỗ trợ từ xa rất nhanh khi cần.",
    rating: 5,
    avatar: "https://res.cloudinary.com/ds55hfvx4/image/upload/v1774666239/Gemini_Generated_Image_uuglokuuglokuugl_oixcvh.png",
  },
];

export const metadata: Metadata = {
  title: "Giới thiệu | MCBROTHER",
  description: "Giới thiệu về MCBROTHER JSC",
};

export default function AboutPage() {
  return (
    <main className="bg-[var(--color-bg)] text-slate-800">

      {/* ===== HERO ===== */}
      <section className="relative">
        <img
          src="https://res.cloudinary.com/ds55hfvx4/image/upload/v1774489339/hero_banner_u2ziwq.png"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* 🔥 đổi overlay sang màu brand */}
        <div className="absolute inset-0 bg-[var(--color-primary)]/80" />

        <div className="relative max-w-7xl xl:max-w-[1280px] mx-auto px-4 py-24 text-center text-white">
          <h1 className="text-[34px] md:text-[42px] font-semibold">
            {COMPANY.name}
          </h1>

          <p className="mt-4 text-[16px] text-white/90 max-w-2xl mx-auto">
            {COMPANY.slogan}
          </p>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl xl:max-w-[1280px] mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">

          <div>
            <h2 className="text-[24px] font-semibold text-[var(--color-primary)]">
              Về chúng tôi
            </h2>

            <p className="mt-4 text-gray-600 leading-relaxed">
              {COMPANY.summary}
            </p>
          </div>

          <div className="h-[280px] bg-gray-200 rounded-xl" />
        </div>

        {/* stats */}
        <div className="max-w-7xl xl:max-w-[1280px] mx-auto px-4 mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm hover:shadow-xl transition"
            >
              <div className="text-[26px] font-semibold text-[var(--color-primary)]">
                {s.value}
              </div>
              <div className="text-sm text-gray-600">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== PROCESS ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl xl:max-w-[1280px] mx-auto px-4">

          <h2 className="text-[24px] font-semibold text-[var(--color-primary)] mb-10">
            Quy trình triển khai
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {METHODS.map((m) => (
              <div
                key={m.step}
                className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-xl transition hover:border-[var(--color-primary)]"
              >
                <div className="text-[22px] font-bold text-[var(--color-primary)]">
                  {m.step}
                </div>

                <h3 className="mt-2 font-semibold">{m.title}</h3>

                <p className="text-sm text-gray-600 mt-2">
                  {m.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-20 bg-[var(--color-bg)]">
        <div className="max-w-7xl xl:max-w-[1280px] mx-auto px-4 text-center">

          <p className="text-sm text-gray-500 mb-2">
            Hơn 1.200+ doanh nghiệp đã tin tưởng MCBROTHER
          </p>

          <h2 className="text-[24px] font-semibold text-[var(--color-primary)] mb-10">
            Đánh giá từ khách hàng
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-xl p-5 
      shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {/* HEADER */}
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />

                  <div>
                    <div className="font-semibold text-sm text-gray-800">
                      {t.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {t.role}
                    </div>
                  </div>
                </div>

                {/* CONTENT */}
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  “{t.content}”
                </p>

                {/* FOOTER */}
                <div className="flex items-center justify-between">
                  <div className="text-yellow-400 text-sm">
                    {"★".repeat(t.rating)}
                    {"☆".repeat(5 - t.rating)}
                  </div>

                  <span className="text-xs text-gray-400">
                    Khách hàng đã xác minh
                  </span>
                </div>
              </div>
            ))}
          </div>
          {/* CTA */}
          <div className="mt-12">
            <p className="text-gray-600 mb-4">
              Bạn muốn tối ưu quy trình sản xuất như các khách hàng trên?
            </p>

            <a
              href="https://zalo.me/0834551888"
              target="_blank"
              className="inline-block bg-[var(--color-primary)] text-white px-6 py-3 rounded-lg hover:bg-[var(--color-primary-dark)] transition"
            >
              Liên hệ tư vấn ngay
            </a>
          </div>

        </div>
      </section>

    </main>
  );
}