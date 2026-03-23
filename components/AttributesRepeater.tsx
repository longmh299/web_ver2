// components/AttributesRepeater.tsx
"use client";

import { useState } from "react";

type Row = {
  id?: number | null;
  name: string;
  value: string;
  sort: number;
  deleted?: boolean;
};

export default function AttributesRepeater({
  initial = [],
}: {
  initial?: Row[];
}) {
  const [rows, setRows] = useState<Row[]>(
    initial.length ? initial : [{ name: "", value: "", sort: 0 }]
  );

  function addRow() {
    setRows((s) => [...s, { name: "", value: "", sort: s.length }]);
  }

  function toggleDelete(idx: number) {
    setRows((s) =>
      s.map((r, i) => (i === idx ? { ...r, deleted: !r.deleted } : r))
    );
  }

  function update(idx: number, field: keyof Row, val: string | number) {
    setRows((s) =>
      s.map((r, i) => (i === idx ? { ...r, [field]: val } : r))
    );
  }

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <table className="min-w-[680px] w-full border-collapse">
          <thead className="bg-gray-50 text-sm">
            <tr className="text-left">
              <th className="p-2 w-64">Tên thông số</th>
              <th className="p-2">Giá trị</th>
              <th className="p-2 w-24">Thứ tự</th>
              <th className="p-2 w-24">Xoá</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={idx} className="border-t">
                {/* Hidden truyền id & trạng thái xoá */}
                <input type="hidden" name="attrId[]" value={r.id ?? ""} />
                <input
                  type="hidden"
                  name="attrDelete[]"
                  value={r.deleted ? "1" : ""}
                />

                <td className="p-2 align-top">
                  <input
                    name="attrName[]"
                    value={r.name}
                    onChange={(e) => update(idx, "name", e.target.value)}
                    className={`w-full rounded border px-2 py-1 ${
                      r.deleted ? "line-through opacity-60" : ""
                    }`}
                    placeholder="Ví dụ: Công suất, Điện áp, Kích thước..."
                  />
                </td>

                <td className="p-2 align-top">
                  <input
                    name="attrValue[]"
                    value={r.value}
                    onChange={(e) => update(idx, "value", e.target.value)}
                    className={`w-full rounded border px-2 py-1 ${
                      r.deleted ? "line-through opacity-60" : ""
                    }`}
                    placeholder="Ví dụ: 9kW, 380V-50Hz..."
                  />
                </td>

                <td className="p-2 align-top">
                  <input
                    type="number"
                    name="attrSort[]"
                    value={r.sort}
                    onChange={(e) => update(idx, "sort", Number(e.target.value || 0))}
                    className="w-full rounded border px-2 py-1"
                  />
                </td>

                <td className="p-2 align-top">
                  <button
                    type="button"
                    onClick={() => toggleDelete(idx)}
                    className={`rounded px-2 py-1 text-sm ${
                      r.deleted
                        ? "bg-gray-300 text-gray-700"
                        : "bg-red-600 text-white"
                    }`}
                    title={r.deleted ? "Hoàn tác xoá" : "Đánh dấu xoá"}
                  >
                    {r.deleted ? "Hoàn tác" : "Xoá"}
                  </button>
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan={4}>
                  Chưa có thông số — bấm “Thêm dòng” để bắt đầu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={addRow}
        className="rounded bg-blue-600 px-3 py-2 text-white"
      >
        + Thêm dòng
      </button>
    </div>
  );
}
