import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: 'export',
    images: {
        unoptimized: true
    },
    basePath: '/~phungj/q-up'
};
export default nextConfig;
