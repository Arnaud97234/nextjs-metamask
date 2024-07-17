/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'static.alchemyapi.io',
                port: '',
                pathname: '/images/assets/**',
            },
        ],
    },
}

export default nextConfig
