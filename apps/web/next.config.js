/** @type {import('next').NextConfig} */
module.exports = {
  transpilePackages: ["@repo/ui"],
  experimental: { 
    nftTracing: true 
  }
};
