"use client";

import { useState } from "react";

export default function ImagesRepeater() {
  const [rows, setRows] = useState<Array<{ url: string; alt: string; sort: number }>>([
    { url: "", alt: "", sort: 0 },
  ]);

  const add = () => setRows((r) => [...r, { url: "", alt: "", sort: 0 }]);
  const remove = (i: number) => setRows((r) => r.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      {rows.map((r, i) => (
        <div key={i} className="grid md:grid-cols-6 gap-2">
          <input name="image_url"  placeholder="URL ảnh" defaultValue={r.url} className="border rounded px-3 py-2 md:col-span-3" />
          <input name="image_alt"  placeholder="ALT (mô tả ảnh)" defaultValue={r.alt} className="border rounded px-3 py-2 md:col-span-2" />
          <input name="image_sort" type="number" defaultValue={r.sort} className="border rounded px-3 py-2" />
          <div className="md:col-span-6">
            <button type="button" onClick={() => remove(i)} className="text-red-600 text-sm">Xoá ảnh</button>
          </div>
        </div>
      ))}

      <button type="button" onClick={add} className="border rounded px-3 py-1">
        + Thêm ảnh
      </button>
      <p className="text-xs opacity-60">
        * Có thể dán URL từ Cloudinary/host khác. Sau khi tạo xong vẫn có thể upload file trong trang Sửa.
      </p>
    </div>
  );
}
