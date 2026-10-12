export const DIMENSIONS = [
  {
    id: "emotion",
    name: "情绪与自我调节",
    description: "面对失望、压力和计划被打乱时，你如何安放情绪并重新找到节奏。",
  },
  {
    id: "relationship",
    name: "人际关系与边界",
    description: "在请求、争执、比较和评价里，你如何对待别人的期待与自己的界限。",
  },
  {
    id: "decision",
    name: "决策与责任感",
    description: "做重要选择、面对错误和长期目标时，你更依靠感觉、他人还是自己的判断。",
  },
  {
    id: "openness",
    name: "开放性与探索欲",
    description: "面对陌生事物、新证据和平淡日子时，你愿意把生活打开多少。",
  },
  {
    id: "self",
    name: "自我认知与未来观",
    description: "独处、回望过去和想象未来时，你如何理解自己可以影响的部分。",
  },
] as const;

export type DimensionId = (typeof DIMENSIONS)[number]["id"];

export type OptionId = "A" | "B" | "C" | "D";

export type ScoreBand = "low" | "mid" | "high";

export interface QuestionOption {
  id: OptionId;
  text: string;
  score: 1 | 2 | 3 | 4;
}

export interface Question {
  id: number;
  dimension: DimensionId;
  question: string;
  options: QuestionOption[];
}

export type Answers = Partial<Record<number, OptionId>>;

export interface QuizState {
  actualAge: number | null;
  answers: Answers;
  currentIndex: number;
}

export interface DimensionScore {
  id: DimensionId;
  name: string;
  description: string;
  score: number;
  percent: number;
  band: ScoreBand;
  order: number;
}

export interface ScoreResult {
  totalScore: number;
  mentalAge: number;
  actualAge: number;
  ageGap: number;
  dimensions: DimensionScore[];
}

export interface DimensionAnalysis {
  id: DimensionId;
  name: string;
  score: number;
  percent: number;
  band: ScoreBand;
  trait: string;
  strength: string;
  blindSpot: string;
  suggestion: string;
}

export interface SynthesisReport {
  mainTendency: string;
  coping: string;
  overlooked: string;
  stressStrategy: string;
  relationshipAdvice: string;
  growthAdvice: string;
}

export interface QuizReport extends ScoreResult {
  summary: string;
  ageGapAnalysis: string;
  dimensionAnalyses: DimensionAnalysis[];
  synthesis: SynthesisReport;
}
