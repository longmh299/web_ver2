// app/gioi-thieu/page.tsx
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
          src="/images/banner2.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />

        <div className="relative max-w-7xl xl:max-w-[1280px] mx-auto px-4 py-24 text-center text-white">
          <h1 className="text-[34px] md:text-[42px] font-semibold">
            {COMPANY.name}
          </h1>

          <p className="mt-4 text-[16px] text-white/80 max-w-2xl mx-auto">
            {COMPANY.slogan}
          </p>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl xl:max-w-[1280px] mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">

          <div>
            <h2 className="text-[24px] font-semibold text-[var(--color-accent)]">
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
              className="bg-white/90 backdrop-blur border border-gray-200 rounded-xl p-6 text-center shadow-sm hover:shadow-xl transition"
            >
              <div className="text-[26px] font-semibold text-[var(--color-accent)]">
                {s.value}
              </div>
              <div className="text-sm text-gray-600">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== VALUES ===== */}
      <section className="py-20 bg-[var(--color-bg)]">
        <div className="max-w-7xl xl:max-w-[1280px] mx-auto px-4">

          <h2 className="text-[24px] font-semibold text-[var(--color-accent)] mb-10">
            Giá trị cốt lõi
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="bg-white/90 backdrop-blur border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-xl transition"
              >
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded bg-[var(--color-accent)]/10 flex items-center justify-center text-[var(--color-accent)]">
                    ✔
                  </div>

                  <div>
                    <h3 className="font-semibold">{v.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{v.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ===== IMAGE BREAK ===== */}
      <section className="relative py-24">
        <img
          src="/images/banner2.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />

        <div className="relative text-center text-white max-w-3xl mx-auto px-4">
          <h3 className="text-[24px] font-semibold">
            Giải pháp phù hợp cho từng doanh nghiệp sản xuất
          </h3>
        </div>
      </section>

      {/* ===== PROCESS ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl xl:max-w-[1280px] mx-auto px-4">

          <h2 className="text-[24px] font-semibold text-[var(--color-accent)] mb-10">
            Quy trình triển khai
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {METHODS.map((m) => (
              <div
                key={m.step}
                className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-xl transition"
              >
                <div className="text-[22px] font-bold text-[var(--color-accent)]">
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

      {/* ===== PARTNERS ===== */}
      <section className="py-20 bg-[var(--color-bg)]">
        <div className="max-w-7xl xl:max-w-[1280px] mx-auto px-4 text-center">

          <h2 className="text-[24px] font-semibold text-[var(--color-accent)] mb-10">
            Khách hàng & đối tác
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-16 bg-gray-100 rounded flex items-center justify-center opacity-70 hover:opacity-100 transition">
                Logo {i}
              </div>
            ))}
          </div>

        </div>
      </section>

    </main>
  );
}