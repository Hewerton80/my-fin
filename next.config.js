/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/auth/login",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [{ hostname: "raw.githubusercontent.com" }],
  },
};

module.exports = nextConfig;
