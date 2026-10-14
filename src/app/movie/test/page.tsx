import type { Metadata } from "next";
import { MovieFlow } from "@/components/movie/MovieFlow";

export const metadata: Metadata = {
  title: "答题",
};

export default function MovieTestPage() {
  return <MovieFlow />;
}
