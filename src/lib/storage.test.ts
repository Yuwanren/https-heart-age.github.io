import assert from "node:assert/strict";
import test from "node:test";
import { initialQuizState } from "@/lib/quiz-state";
import { clearStoredQuiz, loadQuiz, parseStoredQuiz, saveQuiz, STORAGE_KEY, type StorageLike } from "@/lib/storage";
import type { QuizState } from "@/types/quiz";

function memoryStorage(): StorageLike & { dump(): Map<string, string> } {
  const data = new Map<string, string>();
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => {
      data.set(key, value);
    },
    removeItem: (key) => {
      data.delete(key);
    },
    dump: () => data,
  };
}

test("progress survives a simulated refresh and can be cleared", () => {
  const storage = memoryStorage();
  const state: QuizState = {
    actualAge: 27,
    currentIndex: 4,
    answers: { 1: "A", 2: "C", 4: "D" },
  };
  saveQuiz(state, storage);
  assert.deepEqual(loadQuiz(storage), state);
  clearStoredQuiz(storage);
  assert.equal(loadQuiz(storage), null);
  assert.equal(storage.dump().has(STORAGE_KEY), false);
});

test("invalid stored data does not restore a quiz", () => {
  assert.equal(parseStoredQuiz(null), null);
  assert.equal(parseStoredQuiz("{"), null);
  assert.equal(parseStoredQuiz(JSON.stringify({ version: 2 })), null);
  const parsed = parseStoredQuiz(
    JSON.stringify({
      version: 1,
      actualAge: 22,
      currentIndex: 99,
      answers: { 1: "B", 2: "E", 3: "A", 99: "D" },
    }),
  );
  assert.deepEqual(parsed, {
    actualAge: 22,
    currentIndex: 0,
    answers: { 1: "B", 3: "A" },
  });
  assert.equal(parseStoredQuiz(JSON.stringify({ version: 1, actualAge: 8, answers: {}, currentIndex: 0 })), null);
});

test("restarting clears both memory and storage", () => {
  const storage = memoryStorage();
  saveQuiz({ ...initialQuizState, actualAge: 33, currentIndex: 2, answers: { 1: "C" } }, storage);
  clearStoredQuiz(storage);
  assert.equal(loadQuiz(storage), null);
  assert.deepEqual(initialQuizState, { actualAge: null, answers: {}, currentIndex: 0 });
});

test("storage failures and malformed data do not throw", () => {
  const broken: StorageLike = {
    getItem: () => {
      throw new Error("blocked");
    },
    setItem: () => {
      throw new Error("blocked");
    },
    removeItem: () => {
      throw new Error("blocked");
    },
  };
  assert.equal(loadQuiz(broken), null);
  assert.doesNotThrow(() => saveQuiz({ ...initialQuizState, actualAge: 30 }, broken));
  assert.doesNotThrow(() => clearStoredQuiz(broken));
  assert.equal(parseStoredQuiz("[]"), null);
  assert.equal(parseStoredQuiz("null"), null);
  assert.deepEqual(parseStoredQuiz(JSON.stringify({ version: 1, actualAge: null, answers: ["A"], currentIndex: "nope" })), {
    actualAge: null,
    answers: {},
    currentIndex: 0,
  });
});

test("missing storage is ignored", () => {
  assert.equal(loadQuiz(null), null);
  assert.doesNotThrow(() => saveQuiz(initialQuizState, null));
  assert.doesNotThrow(() => clearStoredQuiz(null));
});
