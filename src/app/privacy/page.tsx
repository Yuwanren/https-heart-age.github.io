import type { Metadata } from "next";
import { ClearDataButton } from "@/components/ClearDataButton";
import { DISCLAIMER_NOTE } from "@/data/analysis-content";
import { STORAGE_KEY } from "@/lib/storage";

export const metadata: Metadata = {
  title: "隐私说明",
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto w-full max-w-2xl px-5 py-14 md:py-20">
      <p className="text-sm text-sage">说明</p>
      <h1 className="mt-3 text-3xl font-medium tracking-tight md:text-4xl">隐私与数据说明</h1>
      <div className="mt-8 space-y-5 text-base leading-8 text-foreground">
        <p>这是一个纯前端页面。年龄、选项和报告都在你的浏览器里计算，不需要账号，也不会上传答案。</p>
        <p>
          为了刷新后还能继续，实际年龄、已选答案和当前题号会写入这台设备当前浏览器的 localStorage，键名是{" "}
          <code className="rounded bg-card px-1.5 py-0.5 text-sm break-all">{STORAGE_KEY}</code>
          。换浏览器、使用无痕模式或清理站点数据后，进度会消失。
        </p>
        <p>开始测试前需要测试码。测试码只在当前浏览器里核对，不会上传。通过后，授权会留在这台浏览器，直到测试码到期。到期后再打开，需要新的测试码。知道测试码的人，在到期前仍可以使用。</p>
        <p>网站不收集姓名、生日、手机号或其他无关个人信息。清除本页或页脚中的本地数据后，当前浏览器里的进度和测试码授权会被删除。</p>
        <p>
          如果浏览器禁止本地存储，当次测试仍可完成，但刷新后无法恢复。本地数据没有加密，也没有账号保护。使用同一浏览器的其他人，或清理前导出站点数据的人，仍可能看到留在这台设备上的进度。
        </p>
        <p>{DISCLAIMER_NOTE}</p>
      </div>
      <div className="mt-8">
        <ClearDataButton className="btn btn-secondary" />
      </div>
    </article>
  );
}
