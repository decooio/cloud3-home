/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: false,
  experimental: {
    // ssr and displayName are configured by default
    fontLoaders: [{
      loader: '@next/font/google', options: { subsets: ['normal','medium', 'semibod', 'bold'] }
    }]
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    config.resolve.fallback = {
      os: false,
      assert: false,
      fs: false,
      process: false,
      events: false,
    }
    return config;
  },

  // async redirects() {
  //   return [
  //     {
  //       source: '/:any*',
  //       destination: '/',
  //       permanent: false,
  //     },
  //   ];
  // },
};
