/** @type {import('next').NextConfig} */
const nextConfig = {
    swcMinify: true, // Enable SWC for minification
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.fallback = {
          fs: false,
          path: false,
          os: false,
        };
      }
      return config;
    },
    experimental: {
      forceSwcTransforms: true, // Ensure SWC transforms are enabled
    },
};

export default nextConfig;
