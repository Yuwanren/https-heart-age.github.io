import { QUESTIONS } from "@/data/questions";
import { DIMENSIONS, type Answers, type DimensionScore, type OptionId, type ScoreBand, type ScoreResult } from "@/types/quiz";

export const MENTAL_AGE_MIN = 18;
export const MENTAL_AGE_MAX = 60;
export const TOTAL_SCORE_MIN = 20;
export const TOTAL_SCORE_MAX = 80;
export const DIMENSION_SCORE_MIN = 4;
export const DIMENSION_SCORE_MAX = 16;

const OPTION_IDS: OptionId[] = ["A", "B", "C", "D"];

export function isValidAge(age: unknown): age is number {
  return typeof age === "number" && Number.isInteger(age) && age >= 14 && age <= 100;
}

export function parseAgeInput(value: string): number | null {
  const trimmed = value.trim();
  if (!/^\d+$/.test(trimmed)) return null;
  const age = Number(trimmed);
  return isValidAge(age) ? age : null;
}

export function getAnswer(answers: Answers, questionId: number): OptionId | undefined {
  const value = answers[questionId];
  return OPTION_IDS.includes(value as OptionId) ? (value as OptionId) : undefined;
}

export function isQuizComplete(answers: Answers): boolean {
  return QUESTIONS.every((question) => getAnswer(answers, question.id) !== undefined);
}

export function scoreBand(score: number): ScoreBand {
  if (score <= 7) return "low";
  if (score <= 12) return "mid";
  return "high";
}

export function dimensionPercent(score: number): number {
  return Math.round(((score - DIMENSION_SCORE_MIN) / (DIMENSION_SCORE_MAX - DIMENSION_SCORE_MIN)) * 100);
}

export function mentalAgeFromTotal(totalScore: number): number {
  const estimated = Math.round(18 + ((totalScore - TOTAL_SCORE_MIN) / (TOTAL_SCORE_MAX - TOTAL_SCORE_MIN)) * 42);
  return Math.min(MENTAL_AGE_MAX, Math.max(MENTAL_AGE_MIN, estimated));
}

export function formatAgeGap(ageGap: number): string {
  if (ageGap > 0) return `+${ageGap}`;
  return String(ageGap);
}

export function totalScore(answers: Answers): number {
  return QUESTIONS.reduce((sum, question) => {
    const optionId = getAnswer(answers, question.id);
    const option = question.options.find((item) => item.id === optionId);
    return sum + (option?.score ?? 0);
  }, 0);
}

export function scoreDimensions(answers: Answers): DimensionScore[] {
  return DIMENSIONS.map((dimension, order) => {
    const score = QUESTIONS.filter((question) => question.dimension === dimension.id).reduce((sum, question) => {
      const optionId = getAnswer(answers, question.id);
      const option = question.options.find((item) => item.id === optionId);
      return sum + (option?.score ?? 0);
    }, 0);

    return {
      id: dimension.id,
      name: dimension.name,
      description: dimension.description,
      score,
      percent: dimensionPercent(score),
      band: scoreBand(score),
      order,
    };
  });
}

export function scoreQuiz(actualAge: number, answers: Answers): ScoreResult | null {
  if (!isValidAge(actualAge) || !isQuizComplete(answers)) return null;

  const dimensions = scoreDimensions(answers);
  const summed = dimensions.reduce((sum, dimension) => sum + dimension.score, 0);
  const mentalAge = mentalAgeFromTotal(summed);

  return {
    totalScore: summed,
    mentalAge,
    actualAge,
    ageGap: mentalAge - actualAge,
    dimensions,
  };
}
