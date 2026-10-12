import assert from "node:assert/strict";
import test from "node:test";
import { CLOSING_NOTE, DISCLAIMER_NOTE, SUMMARY_LEAD, SUMMARY_LOW } from "@/data/analysis-content";
import { QUESTIONS } from "@/data/questions";
import { generateReport, rankDimensions } from "@/lib/result-generator";
import type { Answers, DimensionId, OptionId } from "@/types/quiz";

const BANNED = ["幼稚", "不成熟", "童心", "更优秀", "抑郁症", "焦虑症", "人格障碍"];

function allOption(optionId: OptionId): Answers {
  return Object.fromEntries(QUESTIONS.map((question) => [question.id, optionId]));
}

function answersFor(patterns: Record<DimensionId, number[]>): Answers {
  const cursor: Record<DimensionId, number> = {
    emotion: 0,
    relationship: 0,
    decision: 0,
    openness: 0,
    self: 0,
  };
  const answers: Answers = {};
  for (const question of QUESTIONS) {
    const score = patterns[question.dimension][cursor[question.dimension]];
    cursor[question.dimension] += 1;
    const option = question.options.find((item) => item.score === score);
    assert.ok(option);
    answers[question.id] = option.id;
  }
  return answers;
}

function reportText(report: NonNullable<ReturnType<typeof generateReport>>): string {
  return JSON.stringify(report);
}

test("the same answers always generate the same report", () => {
  const answers = allOption("C");
  assert.deepEqual(generateReport(32, answers), generateReport(32, answers));
});

test("different answer patterns do not share one summary", () => {
  const low = generateReport(40, allOption("A"));
  const high = generateReport(40, allOption("D"));
  assert.ok(low && high);
  assert.notEqual(low.summary, high.summary);
  assert.match(low.summary, /当下的感受和直接反应/);
  assert.match(high.summary, /感受、界限和调整空间/);
});

test("tied dimensions use a stable order", () => {
  const report = generateReport(46, allOption("C"));
  assert.ok(report);
  const ranked = rankDimensions(report.dimensions);
  assert.equal(ranked.top.id, "emotion");
  assert.equal(ranked.second.id, "relationship");
  assert.equal(ranked.lowest.id, "decision");
  assert.match(report.synthesis.mainTendency, /得分相同/);
  assert.match(report.summary, new RegExp(SUMMARY_LEAD.emotion));
});

test("summary follows the highest and lowest dimensions", () => {
  const report = generateReport(30, answersFor({
    emotion: [1, 1, 1, 1],
    relationship: [4, 4, 4, 4],
    decision: [4, 4, 4, 4],
    openness: [4, 4, 4, 4],
    self: [4, 4, 4, 4],
  }));
  assert.ok(report);
  assert.match(report.summary, new RegExp(SUMMARY_LEAD.relationship));
  assert.match(report.summary, new RegExp(SUMMARY_LOW.emotion));
  assert.match(report.synthesis.overlooked, /情绪与自我调节/);
});

test("age gap copy covers lower, equal, and higher estimates", () => {
  const answers = allOption("C");
  const lower = generateReport(60, answers);
  const equal = generateReport(46, answers);
  const higher = generateReport(30, answers);
  const close = generateReport(45, answers);
  assert.ok(lower && equal && higher && close);
  assert.ok(lower.ageGap < 0);
  assert.match(lower.ageGapAnalysis, /低 14 岁/);
  assert.equal(equal.ageGap, 0);
  assert.match(equal.ageGapAnalysis, /同为 46 岁/);
  assert.match(equal.ageGapAnalysis, /并不代表心理发展程度与实际年龄完全相同/);
  assert.ok(higher.ageGap > 0);
  assert.match(higher.ageGapAnalysis, /高 16 岁/);
  assert.match(close.ageGapAnalysis, /差值很小/);
});

test("every dimension boundary generates a distinct valid analysis", () => {
  const bands = [
    [4, "low"],
    [7, "low"],
    [8, "mid"],
    [12, "mid"],
    [13, "high"],
    [16, "high"],
  ] as const;
  const patterns: Record<number, number[]> = {
    4: [1, 1, 1, 1],
    7: [1, 2, 2, 2],
    8: [2, 2, 2, 2],
    12: [3, 3, 3, 3],
    13: [4, 3, 3, 3],
    16: [4, 4, 4, 4],
  };

  for (const dimension of ["emotion", "relationship", "decision", "openness", "self"] as const) {
    for (const [score, band] of bands) {
      const pattern: Record<DimensionId, number[]> = {
        emotion: [3, 3, 3, 3],
        relationship: [3, 3, 3, 3],
        decision: [3, 3, 3, 3],
        openness: [3, 3, 3, 3],
        self: [3, 3, 3, 3],
      };
      pattern[dimension] = patterns[score];
      const report = generateReport(35, answersFor(pattern));
      assert.ok(report);
      const analysis = report.dimensionAnalyses.find((item) => item.id === dimension);
      assert.ok(analysis);
      assert.equal(analysis.score, score);
      assert.equal(analysis.band, band);
      assert.match(analysis.trait, /这四题/);
      assert.ok(analysis.strength.length > 8);
      assert.ok(analysis.blindSpot.length > 8);
      assert.ok(analysis.suggestion.length > 8);
      if (band === "low") assert.match(analysis.trait, /不代表能力不足/);
      if (score === 8 || score === 12) assert.doesNotMatch(analysis.trait, /随情境变化/);
      if (score === 7 || score === 13) assert.match(analysis.trait, /并不相同/);
    }
  }
});

test("generated narrative avoids judgmental wording and keeps the fixed ending", () => {
  for (const optionId of ["A", "B", "C", "D"] as const) {
    const report = generateReport(optionId === "D" ? 18 : 70, allOption(optionId));
    assert.ok(report);
    for (const word of BANNED) {
      assert.equal(reportText(report).includes(word), false, word);
    }
  }
  assert.equal(
    CLOSING_NOTE,
    "心理年龄不是对你的定义。它只是你在这一刻、面对这些情境时所呈现出的部分倾向。你可以保持理性，也可以偶尔冲动；可以追求稳定，也可以不断探索。真正重要的不是成为某个年龄段的人，而是逐渐理解自己，并活出适合自己的节奏。",
  );
  assert.equal(
    DISCLAIMER_NOTE,
    "本测试为娱乐与自我探索用途，采用自定义评分规则，并非经过临床验证的心理测量工具。测试结果不能用于心理诊断，也不能代表一个人的全部人格或心理成熟程度。",
  );
});

test("an unfinished quiz cannot generate a report", () => {
  const answers = allOption("A");
  delete answers[20];
  assert.equal(generateReport(28, answers), null);
});

test("the same dimension score with different answers changes the reading", () => {
  const shared = {
    relationship: [3, 3, 3, 3],
    decision: [3, 3, 3, 3],
    openness: [3, 3, 3, 3],
    self: [3, 3, 3, 3],
  };
  const earlier = generateReport(30, answersFor({ emotion: [1, 2, 2, 2], ...shared }));
  const later = generateReport(30, answersFor({ emotion: [2, 2, 2, 1], ...shared }));
  assert.ok(earlier && later);
  const first = earlier.dimensionAnalyses.find((item) => item.id === "emotion");
  const second = later.dimensionAnalyses.find((item) => item.id === "emotion");
  assert.ok(first && second);
  assert.equal(first.score, second.score);
  assert.notEqual(first.trait, second.trait);
  assert.match(first.trait, /其中「期待落空时」/);
  assert.match(second.trait, /其中「计划被打乱时」/);
  assert.match(first.suggestion, /期待落空时/);
  assert.match(second.suggestion, /计划被打乱时/);
  for (const analysis of [first, second]) {
    for (const field of ["trait", "strength", "blindSpot", "suggestion"] as const) {
      assert.ok(analysis[field].trim().length > 8);
    }
  }
});

test("uniform answers are not described as switching with every situation", () => {
  const report = generateReport(30, allOption("C"));
  assert.ok(report);
  const traits = report.dimensionAnalyses.map((item) => item.trait);
  assert.equal(new Set(traits).size, traits.length);
  for (const analysis of report.dimensionAnalyses) {
    assert.equal(analysis.band, "mid");
    assert.match(analysis.trait, /比较一致/);
    assert.doesNotMatch(analysis.trait, /随情境变化/);
    assert.doesNotMatch(reportText(report), /科学验证/);
    assert.doesNotMatch(reportText(report), /随情境变化/);
    assert.doesNotMatch(analysis.trait, /客观的心理发展年龄/);
  }
});

test("mixed middle scores mention that the answers differ", () => {
  const report = generateReport(30, answersFor({
    emotion: [2, 2, 3, 3],
    relationship: [3, 3, 3, 3],
    decision: [3, 3, 3, 3],
    openness: [3, 3, 3, 3],
    self: [3, 3, 3, 3],
  }));
  assert.ok(report);
  const emotion = report.dimensionAnalyses.find((item) => item.id === "emotion");
  assert.ok(emotion);
  assert.equal(emotion.score, 10);
  assert.equal(emotion.band, "mid");
  assert.match(emotion.trait, /并不相同/);
  assert.match(emotion.trait, /随情境变化/);
  assert.match(emotion.blindSpot, /不是每道题都如此/);
});
