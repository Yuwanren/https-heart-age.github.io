"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AccessForm } from "@/components/AccessForm";
import { useAccess } from "@/components/AccessProvider";
import { AgeInput } from "@/components/AgeInput";
import { ProgressBar } from "@/components/ProgressBar";
import { QuestionCard } from "@/components/QuestionCard";
import { useQuiz } from "@/components/QuizProvider";
import { QUESTIONS } from "@/data/questions";
import { answeredCount, canGenerateResult, firstUnansweredIndex } from "@/lib/quiz-state";
import { saveQuiz } from "@/lib/storage";
import { getAnswer } from "@/lib/scoring";
import { AGE_HOME, AGE_RESULT } from "@/lib/routes";
import { DIMENSIONS } from "@/types/quiz";

export function TestFlow() {
  const { ready: accessReady, allowed } = useAccess();
  const { ready, state, setActualAge, selectAnswer, next, prev, goTo } = useQuiz();
  const router = useRouter();
  const [editingAge, setEditingAge] = useState(false);
  const question = QUESTIONS[state.currentIndex];
  const selected = question ? getAnswer(state.answers, question.id) : undefined;
  const isLast = state.currentIndex === QUESTIONS.length - 1;
  const completed = answeredCount(state.answers);
  const canGenerate = canGenerateResult(state);
  const dimensionName = DIMENSIONS.find((dimension) => dimension.id === question?.dimension)?.name ?? "";

  useEffect(() => {
    if (!ready || state.actualAge === null) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }, [ready, state.actualAge, state.currentIndex]);

  if (!ready || !accessReady) {
    return <p className="px-5 py-20 text-center text-sm text-muted">正在读取保存在当前浏览器中的进度…</p>;
  }

  if (!allowed) {
    return (
      <div className="mx-auto w-full max-w-xl px-5 py-14">
        <AccessForm />
      </div>
    );
  }

  if (state.actualAge === null || editingAge) {
    return (
      <AgeInput
        initialAge={state.actualAge}
        onSubmit={(age) => {
          setActualAge(age);
          setEditingAge(false);
        }}
      />
    );
  }

  if (!question) return null;

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-8 md:py-12">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted tabular-nums">
          {String(question.id).padStart(2, "0")} / {String(QUESTIONS.length).padStart(2, "0")}
        </p>
        <Link href={AGE_HOME} className="btn btn-text">
          返回首页
        </Link>
      </div>
      <div className="mt-4">
        <ProgressBar value={completed} max={QUESTIONS.length} />
      </div>
      <p className="mt-3 text-xs leading-6 text-muted">
        实际年龄 {state.actualAge} 岁。
        <button
          type="button"
          className="ml-2 inline-flex min-h-11 items-center text-foreground underline decoration-line underline-offset-4"
          onClick={() => setEditingAge(true)}
        >
          修改年龄
        </button>
        <span className="mt-1 block">返回首页后，进度仍会留在当前浏览器。</span>
      </p>

      <div className="mt-8">
        <QuestionCard
          question={question}
          dimensionName={dimensionName}
          selected={selected}
          onSelect={(optionId) => selectAnswer(question.id, optionId)}
        />
      </div>

      <div className="mt-8 border-t border-line pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {!selected ? <p className="mb-3 text-sm text-muted">请先选择一个最接近的选项。</p> : null}
        {isLast && selected && !canGenerate ? (
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted">还有题目未完成，完成全部 20 题后才能生成结果。</p>
            <button type="button" className="btn btn-text px-0" onClick={() => goTo(firstUnansweredIndex(state.answers))}>
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
              disabled={!canGenerate}
              onClick={() => {
                if (!canGenerateResult(state)) return;
                saveQuiz(state);
                router.push(AGE_RESULT);
              }}
            >
              生成我的测试结果
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
