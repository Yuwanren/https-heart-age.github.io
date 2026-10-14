import type { Metadata } from "next";
import { MovieClearButton } from "@/components/movie/MovieClearButton";
import { MOVIE_ACCESS_STORAGE_KEY } from "@/lib/movie-access";
import { MOVIE_STORAGE_KEY } from "@/lib/movie-storage";

export const metadata: Metadata = {
  title: "说明",
};

export default function MoviePrivacyPage() {
  return (
    <article className="mx-auto w-full max-w-2xl px-5 py-14 md:py-20">
      <p className="text-sm text-sage">说明</p>
      <h1 className="mt-3 text-3xl font-medium tracking-tight md:text-4xl">这部测试的数据</h1>
      <div className="mt-8 space-y-5 text-base leading-8 text-foreground">
        <p>选项和结果在当前浏览器里计算，不需要账号，也不会上传。</p>
        <p>
          进度保存在 localStorage，键名是 <code className="rounded bg-card px-1.5 py-0.5 text-sm break-all">{MOVIE_STORAGE_KEY}</code>
          。本周测试码的授权另存为 <code className="rounded bg-card px-1.5 py-0.5 text-sm break-all">{MOVIE_ACCESS_STORAGE_KEY}</code>
          ，到下周一 0 点（北京时间）失效。
        </p>
        <p>测试码只在这台浏览器里核对。知道本周测试码的人，在周一 0 点之前都可以用。心理年龄测试用的是另一套按天更换的码。</p>
        <p>这是看过《喜剧之王》之后的对照，不是性格鉴定。清除本页数据，不会删掉心理年龄测试的进度。</p>
      </div>
      <div className="mt-8">
        <MovieClearButton className="btn btn-secondary" />
      </div>
    </article>
  );
}
