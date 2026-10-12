import type { Metadata } from "next";
import { ResultView } from "@/components/ResultView";

export const metadata: Metadata = {
  title: "测试结果",
};

export default function AgeResultPage() {
  return <ResultView />;
}
