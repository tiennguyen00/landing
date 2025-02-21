import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
      },
      {
        protocol: "https",
        hostname: "www.themoviedb.org",
      },
      {
        protocol: "https",
        hostname: "www.maison-ghibli.com",
      },
    ],
  },
  experimental: {
    turbo: {
      rules: {
        "*.glsl": {
          loaders: ["raw-loader"],
        },
      },
    },
  },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.(glsl|vert|frag|fragment)$/,
      use: "raw-loader",
      exclude: /node_modules/,
    });

    return config;
  },
};

export default nextConfig;
