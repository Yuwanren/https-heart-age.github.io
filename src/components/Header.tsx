"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

export function Header() {
  const path = usePathname();
  const onAge = onAgeTest(path);
  const onMovie = onMovieTest(path);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-background/90 pt-[env(safe-area-inset-top)] backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between gap-3 px-5">
        <div className="flex h-full min-w-0 items-center gap-3">
          <Link href="/" className="flex h-full min-h-11 min-w-0 items-center">
            <span className="shrink-0 text-[11px] tracking-[0.22em] text-sage">INNER AGE</span>
          </Link>
          {onAge ? (
            <Link href={AGE_HOME} className="hidden h-full min-h-11 min-w-0 items-center truncate text-sm text-foreground min-[380px]:inline-flex">
              心理年龄测试
            </Link>
          ) : null}
          {onMovie ? (
            <Link href={MOVIE_HOME} className="hidden h-full min-h-11 min-w-0 items-center truncate text-sm text-foreground min-[380px]:inline-flex">
              喜剧之王
            </Link>
          ) : null}
        </div>
        <nav className="flex shrink-0 items-center gap-4 text-sm text-muted">
          {onAge ? (
            <Link href={AGE_PRIVACY} className="inline-flex min-h-11 items-center">
              说明
            </Link>
          ) : null}
          {onMovie ? (
            <Link href={MOVIE_PRIVACY} className="inline-flex min-h-11 items-center">
              说明
            </Link>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
