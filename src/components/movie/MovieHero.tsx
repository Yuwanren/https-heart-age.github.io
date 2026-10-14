"use client";

import Link from "next/link";
import { AccessForm } from "@/components/AccessForm";
import { useMovieAccess } from "@/components/movie/MovieAccessProvider";
import { useMovieQuiz } from "@/components/movie/MovieQuizProvider";
import { CHARACTERS } from "@/data/movie";
import { answeredMovieCount, canFinishMovie } from "@/lib/movie-state";
import { MOVIE_RESULT, MOVIE_TEST } from "@/lib/routes";

export function MovieHero() {
  const { ready: accessReady, allowed, accept } = useMovieAccess();
  const { ready, state } = useMovieQuiz();
  const savedCount = answeredMovieCount(state.answers);
  const complete = canFinishMovie(state);

  return (
    <section className="mx-auto w-full max-w-3xl px-5 pt-14 pb-16 md:pt-20">
      <p className="text-[11px] tracking-[0.22em] text-sage">KING OF COMEDY</p>
      <h1 className="mt-4 text-3xl leading-tight font-medium tracking-tight text-balance md:text-5xl">你更像《喜剧之王》里的谁</h1>
      <p className="mt-4 max-w-xl text-base leading-8 text-muted md:text-lg">15 道题。看过这部电影，答起来会更准。</p>
      <p className="mt-6 text-sm tracking-[0.35em] text-foreground">努力！奋斗！</p>

      <div className="mt-10 flex flex-wrap gap-2">
        {CHARACTERS.map((character) => (
          <span key={character.id} className="rounded-full border border-line bg-card px-3 py-2 text-sm">
            {character.name}
          </span>
        ))}
      </div>

      <div className="mt-12 border-t border-line pt-10">
        {!accessReady ? <p className="text-sm text-muted">正在确认测试码…</p> : null}
        {accessReady && !allowed ? (
          <AccessForm
            accept={accept}
            inputId="movie-access-code"
            description="4 位数字，按北京时间当周有效。每周一 0 点更换。只知道网址不能开始测试。"
            errorMessage="测试码不正确，或已经过了这一周。"
          />
        ) : null}
        {accessReady && allowed ? (
          <div className="flex flex-col items-stretch gap-4 sm:items-start">
            <Link href={MOVIE_TEST} className="btn btn-primary w-full sm:w-auto">
              开始测试
            </Link>
            {ready && savedCount > 0 ? (
              <p className="max-w-xl text-sm leading-6 text-muted">
                {complete ? (
                  <>
                    当前浏览器里留有一份结果。
                    <Link href={MOVIE_RESULT} className="ml-2 inline-flex min-h-11 items-center text-foreground underline decoration-line underline-offset-4">
                      查看结果
                    </Link>
                  </>
                ) : (
                  "当前浏览器里留有未完成的进度。开始测试后，会从上次的位置继续。"
                )}
              </p>
            ) : (
              <p className="max-w-xl text-sm leading-6 text-muted">答题只保存在当前浏览器，不会上传。</p>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}
