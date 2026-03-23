// components/SubmitButton.tsx
'use client';
import { useFormStatus } from 'react-dom';

export default function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded bg-black text-white px-4 py-2 disabled:opacity-60"
    >
      {pending ? 'Đang lưu…' : children}
    </button>
  );
}
