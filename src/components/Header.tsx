import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-background/90 pt-[env(safe-area-inset-top)] backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between gap-3 px-5">
        <Link href="/" className="flex h-full min-h-11 min-w-0 items-center gap-3">
          <span className="shrink-0 text-[11px] tracking-[0.22em] text-sage">INNER AGE</span>
          <span className="hidden truncate text-sm text-foreground min-[380px]:inline">心理年龄测试</span>
        </Link>
        <nav className="flex shrink-0 items-center gap-4 text-sm text-muted">
          <Link href="/privacy" className="min-h-11 inline-flex items-center">
            说明
          </Link>
        </nav>
      </div>
    </header>
  );
}
