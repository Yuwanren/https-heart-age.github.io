"use client";

import Link from "next/link";
import { useQuiz } from "@/components/QuizProvider";
import { answeredCount, canGenerateResult } from "@/lib/quiz-state";

export function HeroSection() {
  const { ready, state } = useQuiz();
  const savedCount = answeredCount(state.answers);
  const hasSaved = state.actualAge !== null || savedCount > 0;
  const complete = canGenerateResult(state);

  return (
    <section className="mx-auto w-full max-w-3xl px-5 pt-14 pb-8 md:pt-20">
      <p className="text-[11px] tracking-[0.22em] text-sage">INNER AGE</p>
      <h1 className="mt-4 text-3xl leading-tight font-medium tracking-tight text-balance md:text-5xl">心理年龄测试</h1>
      <p className="mt-4 max-w-xl text-base leading-8 text-muted md:text-lg">
        你的年龄写在身份证上，你的内心又停留在哪个阶段？
      </p>

      <div className="mt-12 border-t border-line pt-10">
        <h2 className="max-w-xl text-3xl leading-tight font-medium tracking-tight text-balance md:text-4xl">
          你的心理年龄，是多少？
        </h2>
        <p className="mt-5 max-w-xl text-base leading-8 text-foreground">
          20 道关于情绪、关系与自我认知的选择题，带你看见自己的内在状态。
        </p>
        <p className="mt-3 max-w-xl text-base leading-8 text-muted">没有标准答案，选择最接近真实自己的那一个。</p>
        <div className="mt-8 flex flex-col items-stretch gap-4 sm:items-start">
          <Link href="/test" className="btn btn-primary w-full sm:w-auto">
            开始测试
          </Link>
          {ready && hasSaved ? (
            <p className="max-w-xl text-sm leading-6 text-muted">
              {complete ? (
                <>
                  当前浏览器里留有一份完整结果。
                  <Link href="/result" className="ml-2 inline-flex min-h-11 items-center text-foreground underline decoration-line underline-offset-4">
                    查看结果
                  </Link>
                </>
              ) : (
                "当前浏览器里留有未完成的进度。开始测试后，会从上次的位置继续。"
              )}
            </p>
          ) : (
            <p className="max-w-xl text-sm leading-6 text-muted">答题进度只保存在当前浏览器，不会上传。</p>
          )}
        </div>
      </div>
    </section>
  );
}
