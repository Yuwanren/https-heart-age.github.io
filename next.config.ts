import type { NextConfig } from "next";

const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").trim();
const normalizedBasePath = !basePath || basePath === "/" ? "" : (basePath.startsWith("/") ? basePath : `/${basePath}`).replace(/\/$/, "");
const githubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  ...(normalizedBasePath ? { basePath: normalizedBasePath } : {}),
  ...(githubPages
    ? { output: "export" as const, trailingSlash: true }
    : { cacheComponents: true, partialPrefetching: true }),
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
