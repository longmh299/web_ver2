'use client';

type Props = {
  html: string;
};

function normalize(html: string) {
  return html
    .replace(/<h1(\s|>)/gi, '<h2$1')
    .replace(/<\/h1>/gi, '</h2>');
}

export default function ContentRenderer({ html }: Props) {
  const content = normalize(html || '');

  return (
    <article
      className="
        prose max-w-none prose-slate
        prose-headings:font-semibold
        prose-h2:border-l-4 prose-h2:pl-3 prose-h2:border-[var(--color-accent)]
        prose-h2:mt-8 prose-h2:mb-4
        prose-p:leading-relaxed
        prose-img:rounded-xl prose-img:shadow-sm
      "
    >
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  );
}