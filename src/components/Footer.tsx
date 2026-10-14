"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClearDataButton } from "@/components/ClearDataButton";
import { MovieClearButton } from "@/components/movie/MovieClearButton";
import { AGE_HOME, AGE_PRIVACY, MOVIE_HOME, MOVIE_PRIVACY } from "@/lib/routes";

function normalizePath(pathname: string) {
  return pathname.replace(/\/$/, "") || "/";
}

function onAgeTest(pathname: string) {
  const path = normalizePath(pathname);
  return path === AGE_HOME || path.startsWith(`${AGE_HOME}/`);
}

function onMovieTest(pathname: string) {
  const path = normalizePath(pathname);
  return path === MOVIE_HOME || path.startsWith(`${MOVIE_HOME}/`);
}

export function Footer() {
  const path = usePathname();
  const onAge = onAgeTest(path);
  const onMovie = onMovieTest(path);
  const note = onAge
    ? "结果只供自我探索。评分在当前浏览器完成，不会上传。"
    : onMovie
      ? "这是看过电影之后的对照。选择只留在当前浏览器，不会上传。"
      : "选择一项测试。结果在当前浏览器生成，不会上传。";

  return (
    <footer className="mt-auto border-t border-line pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-5 py-8 text-sm leading-6 text-muted sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md">{note}</p>
        {onAge ? (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link href={AGE_PRIVACY} className="inline-flex min-h-11 items-center text-foreground">
              隐私与数据说明
            </Link>
            <ClearDataButton />
          </div>
        ) : null}
        {onMovie ? (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link href={MOVIE_PRIVACY} className="inline-flex min-h-11 items-center text-foreground">
              隐私与数据说明
            </Link>
            <MovieClearButton />
          </div>
        ) : null}
      </div>
    </footer>
  );
}
