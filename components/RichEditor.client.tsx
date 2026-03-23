'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import type { IAllProps as TinyMCEProps } from '@tinymce/tinymce-react';

const TinyMCEEditor = dynamic<TinyMCEProps>(
  () =>
    import('@tinymce/tinymce-react').then(
      (m) => m.Editor as unknown as React.ComponentType<TinyMCEProps>
    ),
  { ssr: false }
);

export default function RichEditorClient({
  apiKey,
  name,
  value = '',
  onChange,
  height = 400,
  placeholder = 'Viết nội dung...',
  className,
  id,
}: any) {
  const [content, setContent] = React.useState(value);

  React.useEffect(() => {
    setContent(value ?? '');
  }, [value]);

  return (
    <div className={className}>
      {name && <input type="hidden" name={name} value={content} />}

      <TinyMCEEditor
        id={id || 'editor'}
        apiKey={apiKey}
        value={content}
        init={{
          height,
          menubar: false,

          /* 🔥 ADD TABLE */
          plugins: ['lists', 'link', 'image', 'table', 'code'],

          toolbar: `
            undo redo |
            h2 h3 |
            bold italic |
            bullist numlist |
            link image |
            table |
            block
          `,

          /* 🔥 TABLE CONFIG */
          table_default_attributes: {
            border: '1',
          },
          table_default_styles: {
            width: '100%',
            borderCollapse: 'collapse',
          },

          /* ================= IMAGE ================= */

          automatic_uploads: true,
          paste_data_images: true,
          image_dimensions: false,

          images_upload_handler: async (blobInfo) => {
            const formData = new FormData();
            formData.append('file', blobInfo.blob());

            const res = await fetch('/api/upload', {
              method: 'POST',
              body: formData,
            });

            const data = await res.json();

            if (!data.ok) throw new Error(data.error);
            return data.url;
          },

          /* ===== MEDIA LIBRARY ===== */
          file_picker_callback: async (callback) => {
            const res = await fetch('/api/media');
            const data = await res.json();

            if (!data.ok) return alert('Không tải được thư viện ảnh');

            const html = data.images
              .map(
                (img: any) => `
                  <img src="${img.thumb}" data-url="${img.url}"
                    style="width:100px;height:100px;object-fit:cover;margin:5px;cursor:pointer;border-radius:6px;" />
                `
              )
              .join('');

            const container = document.createElement('div');
            container.innerHTML = html;
            container.style.display = 'flex';
            container.style.flexWrap = 'wrap';

            const modal = document.createElement('div');
            modal.style.position = 'fixed';
            modal.style.top = '50%';
            modal.style.left = '50%';
            modal.style.transform = 'translate(-50%, -50%)';
            modal.style.background = '#fff';
            modal.style.padding = '16px';
            modal.style.borderRadius = '10px';
            modal.style.zIndex = '9999';
            modal.style.maxHeight = '80vh';
            modal.style.overflow = 'auto';

            modal.appendChild(container);
            document.body.appendChild(modal);

            container.querySelectorAll('img').forEach((img) => {
              img.addEventListener('click', () => {
                const url = img.getAttribute('data-url');

                if (url) {
                  callback(url, { alt: '' });
                  modal.remove();
                }
              });
            });
          },

          /* 🔥 FIX: CHO PHÉP TABLE */
          // valid_elements: `
          //   h2,h3,p,strong,em,ul,ol,li,
          //   a[href|target],
          //   img[src|alt],
          //   div[class],
          //   table,tr,td,th,thead,tbody
          // `,

          // valid_styles: { '*': '' },
          content_style: `
            table { border-collapse: collapse; width: 100%; }
            td, th { border: 1px solid #ddd; padding: 8px; }
          `,
          placeholder,

          setup: (editor) => {

            editor.ui.registry.addMenuButton('block', {
              text: 'Chèn nhanh',
              fetch: (callback) => {
                callback([

                  {
                    type: 'menuitem',
                    text: 'Nút CTA',
                    onAction: () => {
                      editor.insertContent(`
                        <div class="cta-box">
                          <p><strong>Cần tư vấn máy?</strong></p>
                          <a href="/lien-he">Nhận báo giá</a>
                        </div>
                      `);
                    }
                  },

                  {
                    type: 'menuitem',
                    text: 'Ghi chú',
                    onAction: () => {
                      editor.insertContent(`
                        <div class="highlight">
                          Nội dung quan trọng...
                        </div>
                      `);
                    }
                  },

                  {
                    type: 'menuitem',
                    text: 'Cảnh báo',
                    onAction: () => {
                      editor.insertContent(`
                        <div class="warning-box">
                          ⚠ Lưu ý quan trọng...
                        </div>
                      `);
                    }
                  },

                  {
                    type: 'menuitem',
                    text: 'Chèn sản phẩm',
                    onAction: async () => {
                      const res = await fetch('/api/admin/products');
                      const data = await res.json();

                      if (!data.ok) return alert('Không tải được sản phẩm');

                      const html = data.products
                        .map(
                          (p: any) => `
                          <div style="cursor:pointer">
                            <img src="${p.coverImage || ''}"
                              style="width:100%;height:90px;object-fit:cover;border-radius:6px" />
                            <p style="font-size:12px;margin-top:4px">${p.name}</p>
                          </div>
                        `
                        )
                        .join('');

                      const container = document.createElement('div');
                      container.innerHTML = html;
                      container.style.display = 'grid';
                      container.style.gridTemplateColumns = 'repeat(4,1fr)';
                      container.style.gap = '10px';

                      const modal = document.createElement('div');
                      modal.style.position = 'fixed';
                      modal.style.top = '50%';
                      modal.style.left = '50%';
                      modal.style.transform = 'translate(-50%, -50%)';
                      modal.style.background = '#fff';
                      modal.style.padding = '16px';
                      modal.style.borderRadius = '10px';
                      modal.style.zIndex = '9999';
                      modal.style.maxHeight = '80vh';
                      modal.style.overflow = 'auto';

                      modal.appendChild(container);
                      document.body.appendChild(modal);

                      container.querySelectorAll('div').forEach((el, i) => {
                        el.addEventListener('click', () => {
                          const p = data.products[i];

                          editor.insertContent(`
                            <div class="product-box">
                              ${p.coverImage ? `<img src="${p.coverImage}" />` : ''}
                              <p><strong>${p.name}</strong></p>
                              <a href="/san-pham/${p.slug}">Xem chi tiết</a>
                            </div>
                          `);

                          modal.remove();
                        });
                      });
                    }
                  },

                ]);
              }
            });

          }
        }}
        onEditorChange={(html) => {
          setContent(html);
          onChange?.(html);
        }}
      />
    </div>
  );
}