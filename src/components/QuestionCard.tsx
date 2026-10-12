import type { OptionId, Question } from "@/types/quiz";

interface QuestionCardProps {
  question: Question;
  dimensionName: string;
  selected?: OptionId;
  onSelect: (optionId: OptionId) => void;
}

export function QuestionCard({ question, dimensionName, selected, onSelect }: QuestionCardProps) {
  return (
    <section>
      <p className="text-sm text-sage">{dimensionName}</p>
      <h1 className="mt-3 text-2xl leading-snug font-medium tracking-tight text-balance md:text-3xl">
        <span className="mr-2 tabular-nums text-muted">{String(question.id).padStart(2, "0")}</span>
        {question.question}
      </h1>
      <div role="radiogroup" aria-label={question.question} className="mt-8 space-y-3">
        {question.options.map((option) => {
          const isSelected = selected === option.id;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(option.id)}
              className={`flex min-h-14 w-full min-w-0 items-start gap-3 rounded-2xl border px-4 py-4 text-left transition-colors ${
                isSelected
                  ? "border-sage bg-sage-soft"
                  : "border-line bg-card hover:border-sage active:bg-sage-soft"
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm ${
                  isSelected ? "border-sage-deep bg-sage-deep text-white" : "border-line text-muted"
                }`}
              >
                {option.id}
              </span>
              <span className="min-w-0 flex-1 pt-0.5 text-base leading-7 break-words">{option.text}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
