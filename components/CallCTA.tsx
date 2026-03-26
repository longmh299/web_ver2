"use client";

export default function CallCTA() {
  return (
    <div className="fixed bottom-6 left-4 md:left-6 z-50">
      <a
        href="tel:0834551888"
        className="flex items-center bg-[var(--color-primary)] text-white rounded-full shadow-lg pr-4 pl-2 py-1.5 hover:bg-[var(--color-primary-dark)] transition"
      >
        {/* icon + pulse */}
        <div className="relative w-10 h-10 mr-2">
          <span className="absolute inset-0 rounded-full bg-[var(--color-primary)] opacity-40 animate-ping"></span>

          <div className="relative w-10 h-10 rounded-full bg-[var(--color-primary-dark)] flex items-center justify-center">
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