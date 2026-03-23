"use client";
import { useEffect, useState } from "react";

export default function Flash({ msg, ms = 2800 }: { msg?: string; ms?: number }) {
  const [show, setShow] = useState(Boolean(msg));
  useEffect(() => {
    if (!msg) return;
    setShow(true);
    const t = setTimeout(() => setShow(false), ms);
    return () => clearTimeout(t);
  }, [msg, ms]);
  if (!show || !msg) return null;
  return (
    <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-green-700">
      {msg}
    </div>
  );
}
