"use client";

import { useState } from "react";
import { useAccess } from "@/components/AccessProvider";

export function AccessForm() {
  const { accept } = useAccess();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  return (
    <form
      className="rounded-3xl border border-line bg-card px-5 py-7"
      onSubmit={(event) => {
        event.preventDefault();
        if (!value.trim() || pending) return;
        setPending(true);
        void accept(value).then((ok) => {
          setPending(false);
          setError(ok ? "" : "测试码无效，或已经超过 24 小时。");
        });
      }}
    >
      <h2 className="text-xl font-medium tracking-tight">输入测试码</h2>
      <p className="mt-3 text-sm leading-7 text-muted">
        测试码 24 小时内有效。到期后再打开页面，需要新的测试码。只知道网址不能开始测试。
      </p>
      <label htmlFor="access-code" className="mt-6 block text-sm text-foreground">
        测试码
      </label>
      <input
        id="access-code"
        value={value}
        autoComplete="off"
        spellCheck={false}
        className="mt-3 w-full min-w-0 rounded-2xl border border-line bg-background px-4 py-3 text-base leading-7 break-all outline-none focus:border-sage"
        onChange={(event) => {
          setValue(event.target.value);
          setError("");
        }}
      />
      <p className="mt-3 min-h-6 text-sm text-foreground" role="alert">
        {error}
      </p>
      <button type="submit" className="btn btn-primary mt-2 w-full" disabled={!value.trim() || pending}>
        开始测试
      </button>
    </form>
  );
}
