import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    default: "心理年龄测试",
    template: "%s · 心理年龄测试",
  },
  description: "你的年龄写在身份证上，你的内心又停留在哪个阶段？20 道关于情绪、关系与自我认知的选择题。",
};

export default function AgeLayout({ children }: { children: ReactNode }) {
  return children;
}
