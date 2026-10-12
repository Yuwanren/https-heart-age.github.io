"use client";

import { useState } from "react";
import { parseAgeInput } from "@/lib/scoring";

interface AgeInputProps {
  initialAge?: number | null;
  onSubmit: (age: number) => void;
}

export function AgeInput({ initialAge = null, onSubmit }: AgeInputProps) {
  const [value, setValue] = useState(initialAge ? String(initialAge) : "");
  const age = parseAgeInput(value);
  const showError = value.length > 0 && age === null;

  return (
    <section className="mx-auto w-full max-w-xl px-5 py-14 md:py-20">
      <p className="text-sm text-sage">开始之前</p>
      <h1 className="mt-3 text-3xl leading-tight font-medium tracking-tight md:text-4xl">你的实际年龄是？</h1>
      <p className="mt-4 text-base leading-8 text-muted">
        只用于和估算心理年龄比较。请输入 14 到 100 之间的整数。不需要姓名、生日或手机号。
      </p>
      <form
        className="mt-8"
        onSubmit={(event) => {
          event.preventDefault();
          if (age === null) return;
          onSubmit(age);
        }}
      >
        <label htmlFor="actual-age" className="text-sm text-foreground">
          实际年龄
        </label>
        <div className="mt-3 flex items-end gap-3 border-b border-line pb-3 focus-within:border-sage">
          <input
            id="actual-age"
            value={value}
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            enterKeyHint="done"
            aria-describedby="age-hint"
            aria-invalid={showError}
            placeholder="28"
            className="w-full min-w-0 bg-transparent text-5xl font-light tracking-tight text-foreground tabular-nums outline-none placeholder:text-line"
            onChange={(event) => {
              setValue(event.target.value.replace(/\D/g, "").slice(0, 3));
            }}
          />
          <span className="pb-2 text-muted">岁</span>
        </div>
        <p id="age-hint" className={`mt-3 text-sm leading-6 ${showError ? "text-foreground" : "text-muted"}`}>
          {showError ? "请输入 14 到 100 之间的整数。" : "年龄差会用这个数字和估算结果相减。"}
        </p>
        <button type="submit" className="btn btn-primary mt-8 w-full sm:w-auto" disabled={age === null}>
          开始答题
        </button>
      </form>
    </section>
  );
}
