"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function RedirectPage({ href }: { href: string }) {
  const router = useRouter();

  useEffect(() => {
    router.replace(href);
  }, [href, router]);

  return (
    <p className="px-5 py-20 text-center text-sm leading-7 text-muted">
      <Link href={href} className="inline-flex min-h-11 items-center text-foreground underline decoration-line underline-offset-4">
        正在打开心理年龄测试
      </Link>
    </p>
  );
}
