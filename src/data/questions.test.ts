import assert from "node:assert/strict";
import test from "node:test";
import { QUESTIONS } from "@/data/questions";
import { DIMENSIONS, type DimensionId } from "@/types/quiz";

const DIMENSION_IDS = new Set(DIMENSIONS.map((dimension) => dimension.id));

test("there are exactly 20 questions", () => {
  assert.equal(QUESTIONS.length, 20);
  assert.deepEqual(
    QUESTIONS.map((question) => question.id),
    Array.from({ length: 20 }, (_, index) => index + 1),
  );
});

test("every question has four scored options and a valid dimension", () => {
  const counts: Record<DimensionId, number> = {
    emotion: 0,
    relationship: 0,
    decision: 0,
    openness: 0,
    self: 0,
  };

  for (const question of QUESTIONS) {
    assert.equal(question.options.length, 4);
    assert.ok(question.question.trim().length > 0);
    assert.ok(DIMENSION_IDS.has(question.dimension));
    counts[question.dimension] += 1;
    assert.deepEqual(
      question.options.map((option) => [option.id, option.score]),
      [
        ["A", 1],
        ["B", 2],
        ["C", 3],
        ["D", 4],
      ],
    );
    for (const option of question.options) {
      assert.ok(option.text.trim().length > 0);
    }
  }

  assert.deepEqual(counts, {
    emotion: 4,
    relationship: 4,
    decision: 4,
    openness: 4,
    self: 4,
  });
});
