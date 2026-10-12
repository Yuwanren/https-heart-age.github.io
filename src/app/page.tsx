import { HeroSection } from "@/components/HeroSection";
import { DIMENSIONS } from "@/types/quiz";

const FACTS = [
  { title: "共 20 道题", text: "五个维度，每个维度四道题。" },
  { title: "预计 3—5 分钟", text: "按最接近的反应选择即可。" },
  { title: "没有对错", text: "选择最接近真实自己的那一个。" },
  { title: "结果仅供自我探索参考", text: "不是临床测验，也不能用来诊断。" },
];

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <section className="mx-auto w-full max-w-3xl px-5 py-8">
        <h2 className="text-sm text-sage">五个维度</h2>
        <div className="mt-5 space-y-3">
          {DIMENSIONS.map((dimension, index) => (
            <article key={dimension.id} className="rounded-2xl border border-line bg-card px-5 py-5">
              <p className="text-xs text-muted tabular-nums">{String(index + 1).padStart(2, "0")}</p>
              <h3 className="mt-2 text-lg font-medium">{dimension.name}</h3>
              <p className="mt-2 text-sm leading-7 text-muted">{dimension.description}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="mx-auto w-full max-w-3xl px-5 pt-4 pb-16">
        <h2 className="text-sm text-sage">测试说明</h2>
        <div className="mt-5 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
          {FACTS.map((fact) => (
            <article key={fact.title} className="rounded-2xl border border-line bg-card px-5 py-5">
              <h3 className="text-base font-medium">{fact.title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted">{fact.text}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
