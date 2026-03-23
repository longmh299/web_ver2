'use client';

import { useEffect } from 'react';
import ContentRenderer from './ContentRenderer';
import Header from '@/components/Header';

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  cover?: string;
  content: string;
};

export default function PreviewModal({
  open,
  onClose,
  title,
  cover,
  content,
}: Props) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white overflow-auto">

      {/* HEADER (giống web) */}
      <Header categories={[]} />

      {/* CLOSE BUTTON */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 bg-black/70 text-white px-3 py-1 rounded"
      >
        ✕ Đóng
      </button>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">

        <h1 className="text-3xl font-semibold">
          {title}
        </h1>

        {cover && (
          <img
            src={cover}
            className="rounded-xl w-full"
          />
        )}

        {/* CTA */}
        <div className="bg-white border rounded-xl p-4">
          <p className="font-medium mb-2">
            Cần tư vấn máy phù hợp?
          </p>
          <button className="bg-slate-700 text-white px-4 py-2 rounded">
            Nhận báo giá
          </button>
        </div>

        {/* CONTENT */}
        <ContentRenderer html={content} />

      </div>
    </div>
  );
}