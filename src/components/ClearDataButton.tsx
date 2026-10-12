"use client";

import { useRouter } from "next/navigation";
import { useQuiz } from "@/components/QuizProvider";
import { revokeAccess } from "@/lib/access";

export function ClearDataButton({ className = "" }: { className?: string }) {
  const { reset } = useQuiz();
  const router = useRouter();

  return (
    <button
      type="button"
      className={className || "btn btn-text px-0"}
      onClick={() => {
        const confirmed = window.confirm("清除后，保存在当前浏览器中的年龄、答题进度和测试码授权会被删除。");
        if (!confirmed) return;
        revokeAccess();
        reset();
        router.push("/");
      }}
    >
      清除本地数据
    </button>
  );
}
