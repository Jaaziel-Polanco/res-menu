import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "monegroliquor.store",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "sarasellos.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "assets.unileversolutions.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.blogs.es",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "web-app-prod-01.nyc3.cdn.digitaloceanspaces.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "assets.tmecosys.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "mx.boost.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.gourmet.cl",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
