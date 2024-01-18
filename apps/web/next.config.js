
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: ["@repo/ui"],
  reactStrictMode: false,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  experimental: { esmExternals: true },
};

module.exports = nextConfig;


// /** @type {import('next').NextConfig} */
// module.exports = {
//   transpilePackages: ["@repo/ui"],
//   reactStrictMode: false,
// };