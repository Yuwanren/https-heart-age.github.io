import {
  CHOICE_NOTES,
  COPING_COPY,
  DIMENSION_ANALYSIS,
  GROWTH_COPY,
  OPTION_STANCE,
  OVERLOOK_COPY,
  RELATION_COPY,
  RELATION_GAP,
  SITUATION_LABELS,
  STRESS_GAP,
  STRESS_STRENGTH,
  SUMMARY_LEAD,
  SUMMARY_LOW,
  TENDENCY_NOTE,
} from "@/data/analysis-content";
import { QUESTIONS } from "@/data/questions";
import { scoreQuiz, getAnswer } from "@/lib/scoring";
import type {
  Answers,
  DimensionId,
  DimensionScore,
  OptionId,
  QuizReport,
  ScoreResult,
  SynthesisReport,
} from "@/types/quiz";

const OPTION_ORDER: OptionId[] = ["A", "B", "C", "D"];

export function rankDimensions(dimensions: DimensionScore[]): {
  top: DimensionScore;
  second: DimensionScore;
  lowest: DimensionScore;
} {
  const byPriority = [...dimensions].sort((a, b) => b.score - a.score || a.order - b.order);
  const top = byPriority[0];
  const second = byPriority[1];
  const lowest = [...byPriority]
    .filter((item) => item.id !== top.id && item.id !== second.id)
    .sort((a, b) => a.score - b.score || a.order - b.order)[0];

  return { top, second, lowest };
}

export function countChoices(answers: Answers): Record<OptionId, number> {
  const counts: Record<OptionId, number> = { A: 0, B: 0, C: 0, D: 0 };
  for (const question of QUESTIONS) {
    const answer = getAnswer(answers, question.id);
    if (answer) counts[answer] += 1;
  }
  return counts;
}

const OPTION_SCORE: Record<OptionId, number> = { A: 1, B: 2, C: 3, D: 4 };

export interface DimensionPattern {
  uniform: boolean;
  modal: OptionId;
  sentence: string;
  outlierLabel: string | null;
  focusLabel: string;
  supportLabel: string | null;
}

function joinLabels(labels: string[]): string {
  const quoted = labels.map((label) => `「${label}」`);
  if (quoted.length <= 1) return quoted[0] ?? "";
  return `${quoted.slice(0, -1).join("、")}和${quoted[quoted.length - 1]}`;
}

export function describeDimensionPattern(dimensionId: DimensionId, answers: Answers): DimensionPattern {
  const questions = QUESTIONS.filter((question) => question.dimension === dimensionId).sort((a, b) => a.id - b.id);
  const picked = questions.flatMap((question) => {
    const optionId = getAnswer(answers, question.id);
    return optionId ? [{ question, optionId }] : [];
  });

  if (picked.length === 0) {
    return {
      uniform: true,
      modal: "C",
      sentence: "这一维度还没有可对照的回答。",
      outlierLabel: null,
      focusLabel: "这一维度",
      supportLabel: null,
    };
  }

  const counts: Record<OptionId, number> = { A: 0, B: 0, C: 0, D: 0 };
  for (const item of picked) counts[item.optionId] += 1;
  const modal = [...OPTION_ORDER].sort(
    (a, b) => counts[b] - counts[a] || OPTION_ORDER.indexOf(a) - OPTION_ORDER.indexOf(b),
  )[0];
  const uniform = counts[modal] === picked.length;
  const labels = picked.map((item) => SITUATION_LABELS[item.question.id]);

  const diverged = picked
    .filter((item) => item.optionId !== modal)
    .sort(
      (a, b) =>
        Math.abs(OPTION_SCORE[b.optionId] - OPTION_SCORE[modal]) -
          Math.abs(OPTION_SCORE[a.optionId] - OPTION_SCORE[modal]) || a.question.id - b.question.id,
    );
  const outlier = diverged[0] ?? null;
  const support = [...picked]
    .filter((item) => OPTION_SCORE[item.optionId] > OPTION_SCORE[modal])
    .sort((a, b) => OPTION_SCORE[b.optionId] - OPTION_SCORE[a.optionId] || a.question.id - b.question.id)[0];

  const listed = OPTION_ORDER.filter((optionId) => counts[optionId] > 0)
    .map((optionId) => `${counts[optionId]} 次更接近${OPTION_STANCE[optionId]}`)
    .join("，");

  const sentence = uniform
    ? `${joinLabels(labels)}这四题的选择比较一致，都更接近${OPTION_STANCE[modal]}。`
    : `${joinLabels(labels)}这四题的选择并不相同：${listed}。其中「${SITUATION_LABELS[outlier!.question.id]}」更接近${OPTION_STANCE[outlier!.optionId]}。`;

  return {
    uniform,
    modal,
    sentence,
    outlierLabel: outlier ? SITUATION_LABELS[outlier.question.id] : null,
    focusLabel: outlier ? SITUATION_LABELS[outlier.question.id] : SITUATION_LABELS[picked[0].question.id],
    supportLabel: support ? SITUATION_LABELS[support.question.id] : null,
  };
}

export function choiceSentence(answers: Answers): string {
  const counts = countChoices(answers);
  const [leading] = [...OPTION_ORDER].sort(
    (a, b) => counts[b] - counts[a] || OPTION_ORDER.indexOf(a) - OPTION_ORDER.indexOf(b),
  );
  if (counts[leading] >= 8) return `${CHOICE_NOTES[leading]}。`;
  return "你的选项分布比较分散，不同情境下的反应并不相同。";
}

export function buildSummary(score: ScoreResult, answers: Answers): string {
  const { top, second, lowest } = rankDimensions(score.dimensions);
  const spread = top.score - lowest.score;
  const choiceNote = choiceSentence(answers);
  const topPattern = describeDimensionPattern(top.id, answers);
  const specific = topPattern.outlierLabel
    ? `在${top.name}里，「${topPattern.outlierLabel}」和其他题目不完全一样。`
    : `在${top.name}的题目里，选择比较一致。`;

  if (spread <= 2) {
    return `五个维度的回答比较接近，没有被单一侧面主导。相对更明显的是${SUMMARY_LEAD[top.id]}（${top.name} ${top.score}/16），同时也看得到${SUMMARY_LEAD[second.id]}（${second.name} ${second.score}/16）。${specific}${choiceNote}`;
  }

  const lowestClause =
    lowest.band === "high"
      ? `即便相对靠后的「${lowest.name}」也多为留有余地的选择（${lowest.score}/16）`
      : lowest.band === "mid"
        ? `相对靠后的「${lowest.name}」会随具体题目变化（${lowest.score}/16）`
        : `${SUMMARY_LOW[lowest.id]}（${lowest.name} ${lowest.score}/16）`;

  return `你的回答呈现出${SUMMARY_LEAD[top.id]}（${top.name} ${top.score}/16），同时也保留了${SUMMARY_LEAD[second.id]}（${second.name} ${second.score}/16）。相比之下，${lowestClause}。${specific}${choiceNote}`;
}

function dimensionById(dimensions: DimensionScore[]): Record<DimensionId, DimensionScore> {
  return Object.fromEntries(dimensions.map((dimension) => [dimension.id, dimension])) as Record<
    DimensionId,
    DimensionScore
  >;
}

function exampleSituation(dimensionIds: DimensionId[], answers: Answers, prefer: "low" | "high"): string {
  const questions = QUESTIONS.filter((question) => dimensionIds.includes(question.dimension))
    .map((question) => {
      const optionId = getAnswer(answers, question.id);
      return optionId ? { question, optionId, score: OPTION_SCORE[optionId] } : null;
    })
    .filter((item): item is { question: (typeof QUESTIONS)[number]; optionId: OptionId; score: number } => item !== null)
    .sort((a, b) => (prefer === "low" ? a.score - b.score : b.score - a.score) || a.question.id - b.question.id);

  const picked = questions[0];
  if (!picked) return "";
  return `例如在「${SITUATION_LABELS[picked.question.id]}」，你的选择更接近${OPTION_STANCE[picked.optionId]}。`;
}

export function buildAgeGapAnalysis(score: ScoreResult, answers: Answers): string {
  const { mentalAge, actualAge, ageGap, dimensions } = score;

  if (ageGap === 0) {
    const counts = countChoices(answers);
    const varied = OPTION_ORDER.filter((optionId) => counts[optionId] > 0).length > 1;
    const variety = varied
      ? "数值相同，不代表每道题的反应都一样。"
      : "这次各题的选择比较接近。数值相同，仍然不能当成心理发展程度和实际年龄一致。";
    return `估算心理年龄与你填写的实际年龄同为 ${mentalAge} 岁。两者在数值上一致，但这并不代表心理发展程度与实际年龄完全相同。它只说明，按这套自定义规则换算后，两个数字碰到了一起。${variety}`;
  }

  const absoluteGap = Math.abs(ageGap);
  const closeness = absoluteGap <= 2 ? "这个差值很小，数值上已经很接近。" : "";

  if (ageGap < 0) {
    const byId = dimensionById(dimensions);
    const related = [byId.emotion, byId.openness, byId.self];
    const softer = related.filter((dimension) => dimension.band !== "high");
    const source = (softer.length > 0 ? softer : related)
      .map((dimension) => `${dimension.name}（${dimension.score}/16）`)
      .join("、");
    const example = exampleSituation(
      (softer.length > 0 ? softer : related).map((dimension) => dimension.id),
      answers,
      "low",
    );

    return `估算心理年龄是 ${mentalAge} 岁，比实际年龄 ${actualAge} 岁低 ${absoluteGap} 岁。${closeness}按本次自定义规则，较低的估算值来自更靠近当下感受或直接反应的选择。相关题目主要落在${source}。${example}这里描述的是这次回答的倾向，不能当成客观的心理发展年龄。`;
  }

  const higher = dimensions.filter((dimension) => dimension.band === "high");
  const exampleIds = higher.length > 0 ? higher.map((dimension) => dimension.id) : dimensions.map((dimension) => dimension.id);
  const example = exampleSituation(exampleIds, answers, "high");
  const source =
    higher.length > 0
      ? `这次换算里，相对更高的分数来自${higher.map((dimension) => `${dimension.name}（${dimension.score}/16）`).join("、")}。`
      : "这次没有单独特别高的维度，估算偏高来自各题选择的累加。";

  return `估算心理年龄是 ${mentalAge} 岁，比实际年龄 ${actualAge} 岁高 ${absoluteGap} 岁。${closeness}${source}${example}更高的估算值只对应问卷里的某些选择，不能用来比较人与人的高低，也不能说明生活必须一直保持克制。`;
}

function overlookPrefix(lowest: DimensionScore, uniform: boolean): string {
  if (lowest.band === "high") {
    return `「${lowest.name}」是五个维度里相对靠后的一项，但分数仍然偏向留有余地的选项。可以留意的是：`;
  }
  if (lowest.band === "mid" && uniform) {
    return `「${lowest.name}」是五个维度里相对靠后的一项，这组选择比较一致。可以留意的是：`;
  }
  if (lowest.band === "mid") {
    return `「${lowest.name}」呈现混合、随情境变化的倾向。忙起来时更容易忽略的是：`;
  }
  return `「${lowest.name}」里较少出现高分选项。这不代表能力不足。相对容易忽略的是：`;
}

function buildDimensionCopy(dimension: DimensionScore, answers: Answers) {
  const base = DIMENSION_ANALYSIS[dimension.id][dimension.band];
  const pattern = describeDimensionPattern(dimension.id, answers);
  let trait = pattern.sentence;
  if (dimension.band === "low") {
    trait += "这不代表能力不足。";
  } else if (dimension.band === "mid" && pattern.uniform) {
    trait += "整体更像一种比较稳定的应对偏好。";
  } else if (dimension.band === "mid") {
    trait += "整体呈现随情境变化的倾向。";
  } else {
    trait += "这只说明这次问卷里的回答倾向，不是心理发展程度的判定。";
  }

  const strength = pattern.supportLabel
    ? `${base.strength}「${pattern.supportLabel}」比同组里更常见的反应多留了一点余地。`
    : base.strength;
  const blindSpot = pattern.outlierLabel
    ? `${base.blindSpot}这不是每道题都如此。「${pattern.outlierLabel}」和其他题目不完全一样。`
    : base.blindSpot;
  const suggestion = `${base.suggestion}这次可以优先放在「${pattern.focusLabel}」里试一次。`;

  return { trait, strength, blindSpot, suggestion };
}

export function buildSynthesis(score: ScoreResult, answers: Answers): SynthesisReport {
  const { top, second, lowest } = rankDimensions(score.dimensions);
  const topPattern = describeDimensionPattern(top.id, answers);
  const lowestPattern = describeDimensionPattern(lowest.id, answers);
  const tie =
    top.score === second.score
      ? `「${top.name}」和「${second.name}」得分相同，报告按固定顺序把前者放在前面。`
      : `「${top.name}」比「${second.name}」更突出一些。`;
  const limit = lowestPattern.outlierLabel
    ? `其中「${lowestPattern.outlierLabel}」和其他题目不完全一样，所以下面的提醒并不覆盖每一道题。`
    : "";

  return {
    mainTendency: `你的主要心理倾向集中在「${top.name}」和「${second.name}」。${tie}「${top.name}」里较常出现的是${OPTION_STANCE[topPattern.modal]}。${TENDENCY_NOTE[top.id]}${TENDENCY_NOTE[second.id]}`,
    coping: `${COPING_COPY[top.id]}${COPING_COPY[second.id]}`,
    overlooked: `${overlookPrefix(lowest, lowestPattern.uniform)}${OVERLOOK_COPY[lowest.id]}${limit}`,
    stressStrategy: `${STRESS_STRENGTH[top.id]}${STRESS_GAP[lowest.id]}`,
    relationshipAdvice: `${RELATION_COPY[top.id]}${RELATION_GAP[lowest.id]}`,
    growthAdvice: `${GROWTH_COPY[lowest.id]}这次可以先从「${lowestPattern.focusLabel}」开始。你也可以继续使用「${top.name}」里已经有效的方式，不必为了改变而推翻自己。`,
  };
}

export function generateReport(actualAge: number, answers: Answers): QuizReport | null {
  const score = scoreQuiz(actualAge, answers);
  if (!score) return null;

  return {
    ...score,
    summary: buildSummary(score, answers),
    ageGapAnalysis: buildAgeGapAnalysis(score, answers),
    dimensionAnalyses: score.dimensions.map((dimension) => ({
      id: dimension.id,
      name: dimension.name,
      score: dimension.score,
      percent: dimension.percent,
      band: dimension.band,
      ...buildDimensionCopy(dimension, answers),
    })),
    synthesis: buildSynthesis(score, answers),
  };
}
