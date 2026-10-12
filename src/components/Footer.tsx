"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClearDataButton } from "@/components/ClearDataButton";
import { AGE_HOME, AGE_PRIVACY } from "@/lib/routes";

function onAgeTest(pathname: string) {
  const path = pathname.replace(/\/$/, "") || "/";
  return path === AGE_HOME || path.startsWith(`${AGE_HOME}/`);
}

export function Footer() {
  const onAge = onAgeTest(usePathname());

  return (
    <footer className="mt-auto border-t border-line pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-5 py-8 text-sm leading-6 text-muted sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md">
          {onAge ? "结果只供自我探索。评分在当前浏览器完成，不会上传。" : "选择一项测试。结果在当前浏览器生成，不会上传。"}
        </p>
        {onAge ? (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link href={AGE_PRIVACY} className="inline-flex min-h-11 items-center text-foreground">
              隐私与数据说明
            </Link>
            <ClearDataButton />
          </div>
        ) : null}
      </div>
    </footer>
  );
}
