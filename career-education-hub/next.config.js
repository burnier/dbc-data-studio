/** @type {import('next').NextConfig} */
const nextConfig = {
    // Optimize for speed and SEO
    reactStrictMode: true,
    swcMinify: true,
    compress: true,

    // Enable standalone output for Docker
    output: 'standalone',

    // Performance optimizations
    images: {
        formats: ['image/avif', 'image/webp'],
    },

    // Headers for performance
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on'
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN'
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;

