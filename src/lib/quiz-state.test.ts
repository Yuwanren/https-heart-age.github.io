import assert from "node:assert/strict";
import test from "node:test";
import { QUESTIONS } from "@/data/questions";
import {
  answeredCount,
  canGenerateResult,
  firstUnansweredIndex,
  initialQuizState,
  quizReducer,
} from "@/lib/quiz-state";
import type { QuizState } from "@/types/quiz";

test("unanswered questions cannot be skipped", () => {
  const skipped = quizReducer(initialQuizState, { type: "next" });
  assert.equal(skipped, initialQuizState);

  const answered = quizReducer(initialQuizState, { type: "answer", questionId: 1, optionId: "B" });
  const moved = quizReducer(answered, { type: "next" });
  assert.equal(moved.currentIndex, 1);
  assert.equal(moved.answers[1], "B");
});

test("answers can be changed and earlier questions remain", () => {
  let state = quizReducer(initialQuizState, { type: "answer", questionId: 1, optionId: "A" });
  state = quizReducer(state, { type: "answer", questionId: 1, optionId: "D" });
  state = quizReducer(state, { type: "next" });
  state = quizReducer(state, { type: "answer", questionId: 2, optionId: "C" });
  assert.equal(state.answers[1], "D");
  assert.equal(state.answers[2], "C");
  assert.equal(answeredCount(state.answers), 2);
});

test("previous stays on the first question and next stops on the last", () => {
  assert.equal(quizReducer(initialQuizState, { type: "prev" }), initialQuizState);
  const last: QuizState = {
    actualAge: 30,
    currentIndex: QUESTIONS.length - 1,
    answers: { 20: "A" },
  };
  assert.equal(quizReducer(last, { type: "next" }), last);
  assert.equal(quizReducer(last, { type: "prev" }).currentIndex, 18);
});

test("result generation waits for a valid age and all 20 answers", () => {
  let state: QuizState = { ...initialQuizState, actualAge: 28, answers: {} };
  assert.equal(canGenerateResult(state), false);
  for (const question of QUESTIONS) {
    state = quizReducer(state, { type: "answer", questionId: question.id, optionId: "C" });
  }
  assert.equal(canGenerateResult(state), true);
  assert.equal(quizReducer(state, { type: "set-age", age: 13 }), state);
  assert.equal(canGenerateResult({ ...state, actualAge: null }), false);
  assert.equal(firstUnansweredIndex({}), 0);
});

test("reset returns the initial state", () => {
  const dirty = quizReducer(initialQuizState, { type: "set-age", age: 29 });
  assert.deepEqual(quizReducer(dirty, { type: "reset" }), initialQuizState);
});
