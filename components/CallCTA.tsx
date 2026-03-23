"use client";

export default function CallCTA() {
  return (
    <div className="fixed bottom-6 left-4 md:left-6 z-50">
      <a
  href="tel:0918808795"
  className="flex items-center bg-red-500 text-white rounded-full shadow-md pr-4 pl-2 py-1.5 hover:brightness-95 transition"
>
  {/* icon + pulse */}
  <div className="relative w-10 h-10 mr-2">
    <span className="absolute inset-0 rounded-full bg-red-500 opacity-50 animate-ping"></span>

    <div className="relative w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
      <span className="text-white text-base">📞</span>
    </div>
  </div>

  <span className="font-semibold text-sm tracking-wide">
   0834.551.888
  </span>
</a>
    </div>
  );
}