// next.config.mjs
/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        // The rest only matters in normal dev / prod builds
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                pathname: '/**',        // <- required
            },
            // S3 image domain removed - images now handled by n8n workflow
            {
                protocol: 'https',
                hostname: 'www.gravatar.com',
                pathname: '/**',
            },
            // Allow Unsplash images for recipe placeholders
            {
                protocol: 'https',
                hostname: 'source.unsplash.com',
                pathname: '/**',
            },
        ],
        minimumCacheTTL: 2_592_000,          // 30 days
        deviceSizes: [320, 420, 768, 1024, 1280, 1440, 1920],
        imageSizes: [16, 32, 48, 64, 96],
    },
};

export default nextConfig;