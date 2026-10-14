import Link from "next/link";
import { AGE_HOME, MOVIE_HOME } from "@/lib/routes";

const TESTS = [
  {
    href: AGE_HOME,
    index: "01",
    title: "心理年龄测试",
    text: "20 道关于情绪、关系与自我认知的选择题，大约 3—5 分钟。进入后需要当天的 4 位测试码。",
  },
  {
    href: MOVIE_HOME,
    index: "02",
    title: "喜剧之王",
    text: "15 个场面，看你更接近片中的哪一个人物。进入后需要本周的 4 位测试码。",
  },
];

export default function HomePage() {
  return (
    <section className="mx-auto w-full max-w-3xl px-5 pt-14 pb-16 md:pt-20">
      <p className="text-[11px] tracking-[0.22em] text-sage">INNER AGE</p>
      <h1 className="mt-4 text-3xl leading-tight font-medium tracking-tight text-balance md:text-5xl">选择一项测试</h1>
      <p className="mt-4 max-w-xl text-base leading-8 text-muted">每项测试单独进入。结果只留在当前浏览器，不会上传。</p>
      <div className="mt-12 space-y-3">
        {TESTS.map((item) => (
          <Link key={item.href} href={item.href} className="block rounded-3xl border border-line bg-card px-5 py-6">
            <p className="text-xs text-muted tabular-nums">{item.index}</p>
            <h2 className="mt-2 text-2xl font-medium tracking-tight">{item.title}</h2>
            <p className="mt-3 text-sm leading-7 text-muted">{item.text}</p>
            <p className="mt-5 text-sm text-foreground">进入测试</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
