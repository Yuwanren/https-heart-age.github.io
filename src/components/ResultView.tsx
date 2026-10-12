"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { AccessForm } from "@/components/AccessForm";
import { useAccess } from "@/components/AccessProvider";
import { DimensionAnalysis } from "@/components/DimensionAnalysis";
import { DimensionScore } from "@/components/DimensionScore";
import { Disclaimer } from "@/components/Disclaimer";
import { ResultHero } from "@/components/ResultHero";
import { ShareButtons } from "@/components/ShareButtons";
import { useQuiz } from "@/components/QuizProvider";
import { generateReport } from "@/lib/result-generator";
import { AGE_HOME, AGE_TEST } from "@/lib/routes";

const SYNTHESIS_FIELDS = [
  ["你的主要心理倾向", "mainTendency"],
  ["你可能擅长的应对方式", "coping"],
  ["你容易忽略的部分", "overlooked"],
  ["压力情境下可以尝试的策略", "stressStrategy"],
  ["人际关系中的建议", "relationshipAdvice"],
  ["个人成长建议", "growthAdvice"],
] as const;

export function ResultView() {
  const { ready: accessReady, allowed } = useAccess();
  const { ready, state, reset } = useQuiz();
  const router = useRouter();
  const report = useMemo(
    () => (state.actualAge === null ? null : generateReport(state.actualAge, state.answers)),
    [state.actualAge, state.answers],
  );

  function handleRetest() {
    reset();
    router.push(AGE_HOME);
  }

  if (!ready || !accessReady) {
    return <p className="px-5 py-20 text-center text-sm text-muted">正在读取保存在当前浏览器中的结果…</p>;
  }

  if (!allowed) {
    return (
      <div className="mx-auto w-full max-w-xl px-5 py-14">
        <AccessForm />
      </div>
    );
  }

  if (!report) {
    return (
      <section className="mx-auto w-full max-w-xl px-5 py-16">
        <h1 className="text-3xl font-medium tracking-tight">还没有完整的测试结果</h1>
        <p className="mt-4 text-base leading-8 text-muted">
          填写实际年龄并完成全部 20 题后，报告会在这台设备的浏览器里生成，不会上传。
        </p>
        <Link href={AGE_TEST} className="btn btn-primary mt-8 w-full sm:w-auto">
          继续测试
        </Link>
      </section>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8 pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:px-5 md:py-14">
      <ResultHero report={report} />

      <section className="rounded-3xl border border-line bg-card px-5 py-7 md:px-10">
        <h2 className="text-xl font-medium tracking-tight">这次的回答倾向</h2>
        <p className="mt-4 text-base leading-8 break-words">{report.summary}</p>
      </section>

      <section className="rounded-3xl border border-line bg-card px-5 py-8 md:px-10">
        <h2 className="text-2xl font-medium tracking-tight">年龄差</h2>
        <p className="mt-4 text-base leading-8 break-words">{report.ageGapAnalysis}</p>
      </section>

      <DimensionScore dimensions={report.dimensions} />

      <section className="space-y-4">
        <div className="px-1">
          <h2 className="text-2xl font-medium tracking-tight">维度解读</h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            4—7 分描述较少选择高分选项的模式，8—12 分落在中间，是稳定偏好还是随题目变化要看各题的选择，13—16 分描述较常选择高分选项的模式，并指出可能的局限。
          </p>
        </div>
        {report.dimensionAnalyses.map((analysis) => (
          <DimensionAnalysis key={analysis.id} analysis={analysis} />
        ))}
      </section>

      <section className="rounded-3xl border border-line bg-card px-5 py-8 md:px-10">
        <h2 className="text-2xl font-medium tracking-tight">综合分析</h2>
        <p className="mt-3 text-sm leading-7 text-muted">
          根据得分最高的两个维度，以及其余维度中得分最低的一项生成。得分相同时，按固定的维度顺序排序。
        </p>
        <dl className="mt-8 space-y-6">
          {SYNTHESIS_FIELDS.map(([label, key]) => (
            <div key={key}>
              <dt className="text-sm text-sage">{label}</dt>
              <dd className="mt-2 text-base leading-8 break-words">{report.synthesis[key]}</dd>
            </div>
          ))}
        </dl>
      </section>

      <ShareButtons report={report} onRetest={handleRetest} />
      <Disclaimer />
    </div>
  );
}
