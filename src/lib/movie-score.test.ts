import assert from "node:assert/strict";
import test from "node:test";
import { CHARACTER_IDS, MOVIE_QUESTIONS, type CharacterId, type MovieOptionId } from "@/data/movie";
import { scoreMovie } from "@/lib/movie-score";
import { parseStoredMovieQuiz } from "@/lib/movie-storage";

test("the movie quiz has 15 scenes and each character appears ten times", () => {
  assert.equal(MOVIE_QUESTIONS.length, 15);
  const counts = Object.fromEntries(CHARACTER_IDS.map((id) => [id, 0])) as Record<CharacterId, number>;
  for (const question of MOVIE_QUESTIONS) {
    assert.equal(question.options.length, 4);
    const ids = question.options.map((option) => option.id);
    assert.deepEqual(ids, ["A", "B", "C", "D"]);
    const characters = new Set(question.options.map((option) => option.character));
    assert.equal(characters.size, 4);
    for (const option of question.options) counts[option.character] += 1;
  }
  for (const id of CHARACTER_IDS) assert.equal(counts[id], 10);
});

test("choosing one character whenever possible makes that character the result", () => {
  for (const id of CHARACTER_IDS) {
    const answers: Record<number, MovieOptionId> = {};
    for (const question of MOVIE_QUESTIONS) {
      const match = question.options.find((option) => option.character === id);
      answers[question.id] = match?.id ?? question.options[0].id;
    }
    const result = scoreMovie(answers);
    assert.ok(result);
    assert.equal(result.winner.id, id);
    assert.equal(result.scores.reduce((sum, item) => sum + item.score, 0), 15);
  }
});

test("a tie keeps the earlier character in the fixed order", () => {
  const answers: Record<number, MovieOptionId> = {};
  const shared = MOVIE_QUESTIONS.filter((question) => question.options.some((option) => option.character === "yin") && question.options.some((option) => option.character === "liu"));
  for (const question of MOVIE_QUESTIONS) {
    const yin = question.options.find((option) => option.character === "yin");
    const liu = question.options.find((option) => option.character === "liu");
    if (yin && !liu) answers[question.id] = yin.id;
    else if (liu && !yin) answers[question.id] = liu.id;
    else if (yin && liu) answers[question.id] = shared.indexOf(question) < 3 ? yin.id : liu.id;
    else answers[question.id] = question.options[0].id;
  }
  const result = scoreMovie(answers);
  assert.ok(result);
  assert.equal(result.winner.id, "yin");
  assert.equal(result.tied, true);
  assert.equal(scoreMovie({}), null);
  assert.equal(parseStoredMovieQuiz("{"), null);
  assert.equal(parseStoredMovieQuiz('{"version":1,"answers":{"1":"Z"},"currentIndex":99}')?.currentIndex, 0);
});
