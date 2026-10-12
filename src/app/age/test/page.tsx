import type { Metadata } from "next";
import { TestFlow } from "@/components/TestFlow";

export const metadata: Metadata = {
  title: "答题",
};

export default function AgeTestPage() {
  return <TestFlow />;
}
