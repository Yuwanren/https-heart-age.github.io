"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AccessForm } from "@/components/AccessForm";
import { ProgressBar } from "@/components/ProgressBar";
import { useMovieAccess } from "@/components/movie/MovieAccessProvider";
import { useMovieQuiz } from "@/components/movie/MovieQuizProvider";
import { MOVIE_QUESTIONS } from "@/data/movie";
import { answeredMovieCount, canFinishMovie, firstUnansweredMovie } from "@/lib/movie-state";
import { saveMovieQuiz } from "@/lib/movie-storage";
import { MOVIE_HOME, MOVIE_RESULT } from "@/lib/routes";

export function MovieFlow() {
  const { ready: accessReady, allowed, accept } = useMovieAccess();
  const { ready, state, selectAnswer, next, prev, goTo } = useMovieQuiz();
  const router = useRouter();
  const question = MOVIE_QUESTIONS[state.currentIndex];
  const selected = question ? state.answers[question.id] : undefined;
  const isLast = state.currentIndex === MOVIE_QUESTIONS.length - 1;
  const completed = answeredMovieCount(state.answers);
  const canFinish = canFinishMovie(state);

  useEffect(() => {
    if (!ready) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }, [ready, state.currentIndex]);

  if (!ready || !accessReady) {
    return <p className="px-5 py-20 text-center text-sm text-muted">正在读取保存在当前浏览器中的进度…</p>;
  }

  if (!allowed) {
    return (
      <div className="mx-auto w-full max-w-xl px-5 py-14">
        <AccessForm
          accept={accept}
          inputId="movie-access-code"
          description="4 位数字，按北京时间当周有效。每周一 0 点更换。只知道网址不能开始测试。"
          errorMessage="测试码不正确，或已经过了这一周。"
        />
      </div>
    );
  }

  if (!question) return null;

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-8 md:py-12">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted tabular-nums">
          {String(question.id).padStart(2, "0")} / {String(MOVIE_QUESTIONS.length).padStart(2, "0")}
        </p>
        <Link href={MOVIE_HOME} className="btn btn-text">
          返回介绍
        </Link>
      </div>
      <div className="mt-4">
        <ProgressBar value={completed} max={MOVIE_QUESTIONS.length} />
      </div>
      <p className="mt-3 text-sm text-sage">{question.scene}</p>
      <h1 className="mt-3 text-2xl leading-snug font-medium tracking-tight text-balance md:text-3xl">{question.prompt}</h1>
      <div role="radiogroup" aria-label={question.prompt} className="mt-8 space-y-3">
        {question.options.map((option) => {
          const isSelected = selected === option.id;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => selectAnswer(question.id, option.id)}
              className={`flex min-h-14 w-full min-w-0 items-start gap-3 rounded-2xl border px-4 py-4 text-left transition-colors ${
                isSelected ? "border-sage bg-sage-soft" : "border-line bg-card hover:border-sage active:bg-sage-soft"
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm ${
                  isSelected ? "border-sage-deep bg-sage-deep text-white" : "border-line text-muted"
                }`}
              >
                {option.id}
              </span>
              <span className="min-w-0 flex-1 pt-0.5 text-base leading-7 break-words">{option.text}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-8 border-t border-line pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {!selected ? <p className="mb-3 text-sm text-muted">请先选择一个最接近的做法。</p> : null}
        {isLast && selected && !canFinish ? (
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted">还有场面没选完。15 个都选过，才能看出最像谁。</p>
            <button type="button" className="btn btn-text px-0" onClick={() => goTo(firstUnansweredMovie(state.answers))}>
              回到未完成的题目
            </button>
          </div>
        ) : null}
        <div className="grid grid-cols-1 gap-3 min-[520px]:grid-cols-2">
          <button type="button" className="btn btn-secondary w-full" onClick={prev} disabled={state.currentIndex === 0}>
            上一题
          </button>
          {isLast ? (
            <button
              type="button"
              className="btn btn-primary w-full"
              disabled={!canFinish}
              onClick={() => {
                if (!canFinishMovie(state)) return;
                saveMovieQuiz(state);
                router.push(MOVIE_RESULT);
              }}
            >
              看我最像谁
            </button>
          ) : (
            <button type="button" className="btn btn-primary w-full" onClick={next} disabled={!selected}>
              下一题
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
