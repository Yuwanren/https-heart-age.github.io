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
          setError(ok ? "" : "测试码不正确，或已经过了今天。");
        });
      }}
    >
      <h2 className="text-xl font-medium tracking-tight">输入测试码</h2>
      <p className="mt-3 text-sm leading-7 text-muted">
        4 位数字，按北京时间当天有效。过了 0 点再打开，需要新的测试码。只知道网址不能开始测试。
      </p>
      <label htmlFor="access-code" className="mt-6 block text-sm text-foreground">
        测试码
      </label>
      <input
        id="access-code"
        value={value}
        inputMode="numeric"
        autoComplete="off"
        spellCheck={false}
        maxLength={4}
        placeholder="4 位数字"
        className="mt-3 w-full min-w-0 rounded-2xl border border-line bg-background px-4 py-3 text-center text-2xl tracking-[0.35em] outline-none focus:border-sage"
        onChange={(event) => {
          setValue(event.target.value.replace(/\D/g, "").slice(0, 4));
          setError("");
        }}
      />
      <p className="mt-3 min-h-6 text-sm text-foreground" role="alert">
        {error}
      </p>
      <button type="submit" className="btn btn-primary mt-2 w-full" disabled={value.length !== 4 || pending}>
        开始测试
      </button>
    </form>
  );
}
