
'use client';

import parse, {
  domToReact,
  HTMLReactParserOptions,
} from 'html-react-parser';

import DOMPurify from 'isomorphic-dompurify';

type Props = {
  html: string;
};

function normalize(html: string) {
  return html
    .replace(/<h1(\s|>)/gi, '<h2$1')
    .replace(/<\/h1>/gi, '</h2>');
}

// remove inline style prop khỏi JSX components
function safeAttribs(attribs: Record<string, any> = {}) {
  return Object.fromEntries(
    Object.entries(attribs).filter(
      ([key]) => key !== 'style'
    )
  );
}

// ảnh: loại thêm width/height gốc (thường do TinyMCE/paste chèn kèm)
// để tránh ảnh bị "khóa" chiều cao theo pixel gốc, gây phình layout
function safeImgAttribs(attribs: Record<string, any> = {}) {
  return Object.fromEntries(
    Object.entries(attribs).filter(
      ([key]) => !['style', 'width', 'height'].includes(key)
    )
  );
}

export default function ContentRenderer({ html }: Props) {

  // ===== normalize =====
  const normalized = normalize(html || '');

  // ===== sanitize =====
  // 🔥 FORBID_ATTR: ['style'] — chặn TOÀN BỘ inline style (kể cả trong
  // div/span do bài viết dán vào, ví dụ label chú thích ảnh dùng
  // position:absolute; left:...px không responsive), tránh tràn ngang trang.
  const clean = DOMPurify.sanitize(normalized, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ['script'],
    FORBID_ATTR: ['style'],
  });

  // ===== enhance HTML → React =====
  const options: HTMLReactParserOptions = {

    replace: (node: any) => {

      // ===== IMAGE =====
      if (node.name === 'img') {
        return (
          <img
            {...safeImgAttribs(node.attribs)}
            loading="lazy"
            className="
              rounded-xl
              shadow-sm
              my-6
              w-full
              h-auto
              max-w-full
              object-cover
            "
          />
        );
      }

      // ===== LINK =====
      if (node.name === 'a') {
        return (
          <a
            {...safeAttribs(node.attribs)}
            rel="nofollow noopener"
            className="
              text-blue-600
              underline
              hover:text-blue-800
              transition
            "
          >
            {domToReact(node.children, options)}
          </a>
        );
      }

      // ===== H2 =====
      if (node.name === 'h2') {
        return (
          <h2
            id={node.attribs?.id}
            className="
              border-l-4
              border-[var(--color-accent)]
              pl-3
              mt-10
              mb-4
              scroll-mt-24
              font-semibold
              text-xl
            "
          >
            {domToReact(node.children, options)}
          </h2>
        );
      }

      // ===== AI SUMMARY =====
      if (node.attribs?.class === 'ai-summary') {
        return (
          <div
            className="
              my-6
              rounded-xl
              border
              bg-blue-50
              p-4
            "
          >
            {domToReact(node.children, options)}
          </div>
        );
      }

      // ===== CTA BOX =====
      if (node.attribs?.class === 'cta-box') {
        return (
          <div
            className="
              my-10
              rounded-xl
              bg-slate-900
              p-6
              text-white
            "
          >
            {domToReact(node.children, options)}
          </div>
        );
      }

      // ===== NOTE BOX =====
      if (node.attribs?.class === 'note-box') {
        return (
          <div
            className="
              my-6
              rounded
              border-l-4
              border-blue-500
              bg-blue-50
              p-4
            "
          >
            {domToReact(node.children, options)}
          </div>
        );
      }

    },
  };

  return (

    <article
      className="
        prose
        prose-slate
        max-w-none
        overflow-x-hidden

        prose-headings:font-semibold
        prose-p:leading-relaxed

        prose-img:rounded-xl
        prose-img:shadow-sm

        prose-table:my-6
        prose-table:w-full
        prose-table:border-collapse

        prose-th:border
        prose-th:border-gray-300
        prose-th:bg-gray-50
        prose-th:p-3
        prose-th:text-left

        prose-td:border
        prose-td:border-gray-300
        prose-td:p-3

        prose-ul:my-4
        prose-li:my-1

        prose-blockquote:border-l-4
        prose-blockquote:border-gray-300
        prose-blockquote:pl-4
      "
    >
      {parse(clean, options)}
    </article>

  );
}
