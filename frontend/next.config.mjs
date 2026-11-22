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
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                port: '',
                pathname: '/alchemyapi/image/**',
            },
            {
                protocol: 'https',
                hostname: 'nft2-cdn.alchemy.com',
                port: '',
                pathname: '/cdn-cgi/image/**',
            },
        ],
    },
}

export default nextConfig
