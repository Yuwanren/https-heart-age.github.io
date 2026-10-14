"use client";

import { useRouter } from "next/navigation";
import { useMovieQuiz } from "@/components/movie/MovieQuizProvider";
import { revokeMovieAccess } from "@/lib/movie-access";
import { MOVIE_HOME } from "@/lib/routes";

export function MovieClearButton({ className = "" }: { className?: string }) {
  const { reset } = useMovieQuiz();
  const router = useRouter();

  return (
    <button
      type="button"
      className={className || "btn btn-text px-0"}
      onClick={() => {
        const confirmed = window.confirm("清除后，保存在当前浏览器中的电影测试进度和本周测试码授权会被删除。心理年龄测试不受影响。");
        if (!confirmed) return;
        revokeMovieAccess();
        reset();
        router.push(MOVIE_HOME);
      }}
    >
      清除本地数据
    </button>
  );
}
