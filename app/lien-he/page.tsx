"use client";

import { useState } from "react";
import Link from "next/link";
import FbMessengerChat from "@/components/FbMessengerChat"; // ⬅️ thêm dòng này

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<boolean | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setOk(null); setErr(null);
    const f = e.currentTarget;
    const data = Object.fromEntries(new FormData(f).entries());

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json().catch(() => ({}));
    setLoading(false);
    if (json?.ok) {
      setOk(true);
      f.reset();
    } else {
      setOk(false);
      setErr(json?.error || "Gửi thất bại. Vui lòng thử lại.");
    }
  }

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-8 space-y-10">
        {/* Header */}
        <header className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-semibold">Liên hệ</h1>
          <p className="text-gray-600">Gửi yêu cầu báo giá hoặc câu hỏi — chúng tôi phản hồi sớm nhất.</p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Cột thông tin + Map */}
          <div className="space-y-4">
            <div className="rounded-2xl border p-5 bg-white">
              <h2 className="text-lg font-semibold mb-3">Thông tin</h2>
              <ul className="space-y-2 text-gray-700">
                <li>Điện thoại/Zalo: <Link href="https://zalo.me/0834551888" target="_blank" className="text-blue-600 hover:underline font-medium">0834 551 888</Link></li>
                <li>Email: <a href="mailto:contact@mcbrother.net" className="text-blue-600 hover:underline">mcbrother2013@gmail.com</a></li>
                <li>Địa chỉ: 33 đường số 5, KDC Vĩnh Lộc, P. Bình Hưng Hòa B, Q. Bình Tân,
                TP.HCM</li>
              </ul>
            </div>

            {/* Google Map embed (responsive 16:9) */}
            <div className="rounded-2xl border overflow-hidden bg-white">
              <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                <iframe
                  title="Google Map"
                  className="absolute inset-0 h-full w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  // TODO: thay src bằng địa chỉ thật
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d221.65847940509272!2d106.59103609453759!3d10.807521690744872!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752b9b242e47c1%3A0x5e480b67c566bbf9!2zQ8O0bmcgdHkgY-G7lSBwaOG6p24gdGhp4bq_dCBi4buLIE1DQlJPVEhFUg!5e1!3m2!1svi!2s!4v1759564926729!5m2!1svi!2s"
                />
              </div>
            </div>
          </div>

          {/* Cột form */}
          <div className="rounded-2xl border p-5 bg-white">
            <h2 className="text-lg font-semibold mb-3">Gửi yêu cầu</h2>
            <form onSubmit={onSubmit} className="space-y-3">
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-700">Họ tên *</label>
                  <input name="name" required className="mt-1 w-full rounded-lg border px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">Email *</label>
                  <input type="email" name="email" required className="mt-1 w-full rounded-lg border px-3 py-2" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-700">Số điện thoại</label>
                  <input name="phone" className="mt-1 w-full rounded-lg border px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">Tiêu đề</label>
                  <input name="subject" className="mt-1 w-full rounded-lg border px-3 py-2" />
                </div>
              </div>

              {/* Honeypot chống bot */}
              <input name="website" className="hidden" tabIndex={-1} autoComplete="off" />

              <div>
                <label className="block text-sm text-gray-700">Nội dung *</label>
                <textarea name="message" required rows={5} className="mt-1 w-full rounded-lg border px-3 py-2" />
              </div>

              <div className="pt-1 flex items-center gap-3">
                <button disabled={loading} className="rounded-lg bg-blue-600 text-white px-5 py-2 disabled:opacity-60">
                  {loading ? "Đang gửi..." : "Gửi liên hệ"}
                </button>
                <a href="https://zalo.me/0834551888" target="_blank" className="rounded-lg border px-5 py-2 hover:bg-gray-50">
                  Chat Zalo
                </a>
              </div>

              {ok === true && <p className="text-green-600">Đã gửi! Chúng tôi sẽ phản hồi sớm.</p>}
              {ok === false && <p className="text-red-600">{err}</p>}
            </form>
          </div>
        </div>
      </div>

      {/* ⬇️ Widget FB chat – không render gì trong layout, chỉ inject vào body */}
      <FbMessengerChat />
    </>
  );
}
