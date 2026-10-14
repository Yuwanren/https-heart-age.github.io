import { CHARACTERS, CHARACTER_IDS, MOVIE_QUESTIONS, type CharacterId, type MovieOptionId } from "@/data/movie";

export interface MovieScore {
  id: CharacterId;
  name: string;
  score: number;
}

export interface MovieResult {
  winner: (typeof CHARACTERS)[number];
  tied: boolean;
  scores: MovieScore[];
}

export function scoreMovie(answers: Record<number, MovieOptionId>): MovieResult | null {
  if (MOVIE_QUESTIONS.some((question) => !answers[question.id])) return null;

  const totals = Object.fromEntries(CHARACTER_IDS.map((id) => [id, 0])) as Record<CharacterId, number>;
  for (const question of MOVIE_QUESTIONS) {
    const selected = question.options.find((option) => option.id === answers[question.id]);
    if (!selected) return null;
    totals[selected.character] += 1;
  }

  const scores = CHARACTERS.map((character) => ({
    id: character.id,
    name: character.name,
    score: totals[character.id],
  }));
  const best = Math.max(...scores.map((item) => item.score));
  const leaders = scores.filter((item) => item.score === best);
  const winner = CHARACTERS.find((character) => character.id === leaders[0]?.id);
  if (!winner) return null;

  return { winner, tied: leaders.length > 1, scores };
}
