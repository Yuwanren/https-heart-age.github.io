import assert from "node:assert/strict";
import test from "node:test";
import { QUESTIONS } from "@/data/questions";
import {
  dimensionPercent,
  formatAgeGap,
  isQuizComplete,
  mentalAgeFromTotal,
  parseAgeInput,
  scoreBand,
  scoreQuiz,
} from "@/lib/scoring";
import type { Answers, OptionId } from "@/types/quiz";

function allOption(optionId: OptionId): Answers {
  return Object.fromEntries(QUESTIONS.map((question) => [question.id, optionId]));
}

function withScores(scores: number[]): Answers {
  const answers: Answers = {};
  QUESTIONS.forEach((question, index) => {
    const option = question.options.find((item) => item.score === scores[index]);
    assert.ok(option);
    answers[question.id] = option.id;
  });
  return answers;
}

test("canonical totals map to the published mental ages", () => {
  assert.equal(mentalAgeFromTotal(20), 18);
  assert.equal(mentalAgeFromTotal(50), 39);
  assert.equal(mentalAgeFromTotal(80), 60);
});

test("mental age stays inside 18 to 60 for every possible total", () => {
  for (let total = 20; total <= 80; total += 1) {
    const age = mentalAgeFromTotal(total);
    assert.ok(age >= 18 && age <= 60);
  }
});

test("all low and all high answers score each dimension and the total", () => {
  const low = scoreQuiz(30, allOption("A"));
  const high = scoreQuiz(30, allOption("D"));
  assert.ok(low);
  assert.ok(high);
  assert.equal(low.totalScore, 20);
  assert.equal(low.mentalAge, 18);
  assert.equal(low.ageGap, 18 - 30);
  assert.ok(low.dimensions.every((dimension) => dimension.score === 4 && dimension.percent === 0));
  assert.equal(high.totalScore, 80);
  assert.equal(high.mentalAge, 60);
  assert.equal(high.ageGap, 60 - 30);
  assert.ok(high.dimensions.every((dimension) => dimension.score === 16 && dimension.percent === 100));
});

test("mixed answers keep dimension totals and a total of 50", () => {
  const scores = [1, 2, 3, 4, 2, 2, 2, 2, 3, 3, 3, 3, 4, 3, 3, 3, 4, 4, 4, 4];
  const result = scoreQuiz(28, withScores(scores));
  assert.ok(result);
  assert.deepEqual(
    result.dimensions.map((dimension) => dimension.score),
    [10, 8, 12, 13, 16],
  );
  assert.equal(result.totalScore, 59);
  const fifty = scoreQuiz(40, withScores([...Array(10).fill(2), ...Array(10).fill(3)]));
  assert.ok(fifty);
  assert.equal(fifty.totalScore, 50);
  assert.equal(fifty.mentalAge, 39);
  assert.equal(fifty.ageGap, -1);
});

test("age gap handles negative, zero, and positive values", () => {
  const answers = allOption("C");
  const base = scoreQuiz(46, answers);
  assert.ok(base);
  assert.equal(base.totalScore, 60);
  assert.equal(base.mentalAge, 46);
  assert.equal(base.ageGap, 0);
  assert.equal(scoreQuiz(60, answers)?.ageGap, -14);
  assert.equal(scoreQuiz(30, answers)?.ageGap, 16);
  assert.equal(formatAgeGap(0), "0");
  assert.equal(formatAgeGap(11), "+11");
  assert.equal(formatAgeGap(-6), "-6");
});

test("incomplete answers and invalid ages do not produce a score", () => {
  const answers = allOption("B");
  delete answers[8];
  assert.equal(isQuizComplete(answers), false);
  assert.equal(scoreQuiz(28, answers), null);
  assert.equal(scoreQuiz(13, allOption("A")), null);
  assert.equal(scoreQuiz(101, allOption("A")), null);
  assert.equal(scoreQuiz(14, allOption("A"))?.actualAge, 14);
  assert.equal(scoreQuiz(100, allOption("D"))?.actualAge, 100);
});

test("age input and score bands use the specified boundaries", () => {
  assert.equal(parseAgeInput("14"), 14);
  assert.equal(parseAgeInput("100"), 100);
  assert.equal(parseAgeInput("13"), null);
  assert.equal(parseAgeInput("101"), null);
  assert.equal(parseAgeInput("28.5"), null);
  assert.equal(parseAgeInput("  "), null);
  assert.equal(parseAgeInput("028"), 28);
  assert.equal(scoreBand(4), "low");
  assert.equal(scoreBand(7), "low");
  assert.equal(scoreBand(8), "mid");
  assert.equal(scoreBand(12), "mid");
  assert.equal(scoreBand(13), "high");
  assert.equal(scoreBand(16), "high");
  assert.equal(dimensionPercent(4), 0);
  assert.equal(dimensionPercent(8), 33);
  assert.equal(dimensionPercent(10), 50);
  assert.equal(dimensionPercent(12), 67);
  assert.equal(dimensionPercent(16), 100);
});
