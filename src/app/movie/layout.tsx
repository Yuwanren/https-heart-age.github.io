import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    default: "喜剧之王",
    template: "%s · 喜剧之王",
  },
  description: "15 个场面，看你更接近《喜剧之王》里的哪一个人物。",
};

export default function MovieLayout({ children }: { children: ReactNode }) {
  return children;
}
