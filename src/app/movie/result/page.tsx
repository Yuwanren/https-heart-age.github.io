import type { Metadata } from "next";
import { MovieResult } from "@/components/movie/MovieResult";

export const metadata: Metadata = {
  title: "最像谁",
};

export default function MovieResultPage() {
  return <MovieResult />;
}
