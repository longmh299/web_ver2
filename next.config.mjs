/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        // Bắt mọi request vào www.mcbrother.id.vn
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.mcbrother.id.vn',
          },
        ],
        // Redirect 301 về bản non-www
        destination: 'https://mcbrother.id.vn/:path*',
        permanent: true,
      },
    ];
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'mcbrother.net', pathname: '/upload/**' }, // nếu vẫn dùng ảnh ở đây
    ],
  },
};

export default nextConfig;
