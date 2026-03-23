'use client';

import * as React from 'react';
import { Plus, X } from 'lucide-react';

type Row = { id?: number; name: string; value: string; order: number };

export default function SpecsTableEditor({
  defaultRows,
}: {
  defaultRows?: Row[];
}) {
  const [rows, setRows] = React.useState<Row[]>(
    (defaultRows ?? []).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  );

  function addRow() {
    setRows((r) => [...r, { name: '', value: '', order: r.length }]);
  }

  function removeRow(i: number) {
    setRows((r) => r.filter((_, idx) => idx !== i).map((x, idx) => ({ ...x, order: idx })));
  }

  function update(i: number, patch: Partial<Row>) {
    setRows((r) => r.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="font-semibold">Thông số bổ sung</div>
        <button type="button" onClick={addRow} className="flex items-center gap-1 rounded border px-2 py-1 text-sm hover:bg-gray-50">
          <Plus size={16} /> Thêm dòng
        </button>
      </div>

      <div className="overflow-x-auto rounded border">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 text-left w-[30%]">Tên thông số</th>
              <th className="p-2 text-left">Giá trị</th>
              <th className="p-2 text-left w-20">Thứ tự</th>
              <th className="p-2 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={4} className="p-3 text-center text-gray-500">Chưa có thông số</td></tr>
            ) : rows.map((row, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">
                  <input
                    name="specName[]"
                    value={row.name}
                    onChange={(e) => update(i, { name: e.target.value })}
                    className="w-full border rounded px-2 py-1"
                    placeholder="Ví dụ: Công suất motor"
                  />
                </td>
                <td className="p-2">
                  <input
                    name="specValue[]"
                    value={row.value}
                    onChange={(e) => update(i, { value: e.target.value })}
                    className="w-full border rounded px-2 py-1"
                    placeholder="Ví dụ: 750W"
                  />
                </td>
                <td className="p-2">
                  <input
                    name="specOrder[]"
                    type="number"
                    value={row.order}
                    onChange={(e) => update(i, { order: Number(e.target.value) || 0 })}
                    className="w-full border rounded px-2 py-1"
                  />
                </td>
                <td className="p-2 text-right">
                  <button type="button" onClick={() => removeRow(i)} className="rounded p-1 hover:bg-gray-100">
                    <X size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* hidden inputs để server action biết tổng số dòng (không bắt buộc nhưng hữu ích) */}
      <input type="hidden" name="specCount" value={rows.length} />
    </div>
  );
}
