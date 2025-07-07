/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    esmExternals: 'loose'
  },
  webpack: (config, { isServer }) => {
    // Add fallbacks for Node.js built-ins
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      module: false,
      path: false,
      os: false,
      crypto: false,
      v8: false,
      util: false,
      stream: false,
      buffer: false,
      events: false,
      assert: false,
      url: false,
      querystring: false,
    };
    
    // Handle ESM modules
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    });

    // Additional fallbacks for client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        v8: false,
        module: false,
      };
    }

    return config;
  },
}

module.exports = nextConfig