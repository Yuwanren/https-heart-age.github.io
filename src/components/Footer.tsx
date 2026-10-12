"use client";

import Link from "next/link";
import { ClearDataButton } from "@/components/ClearDataButton";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-5 py-8 text-sm leading-6 text-muted sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md">结果只供自我探索。评分在当前浏览器完成，不会上传。</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link href="/privacy" className="min-h-11 inline-flex items-center text-foreground">
            隐私与数据说明
          </Link>
          <ClearDataButton />
        </div>
      </div>
    </footer>
  );
}
