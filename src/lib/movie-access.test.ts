import assert from "node:assert/strict";
import test from "node:test";
import { accessCodeForDay } from "@/lib/access";
import { movieAccessCodeForWeek, shanghaiWeekEnd, shanghaiWeekStart, verifyMovieAccessCode } from "@/lib/movie-access";

const mondayNoon = Date.parse("2026-10-12T12:00:00+08:00");
const sundayNight = Date.parse("2026-10-18T23:30:00+08:00");
const nextMonday = Date.parse("2026-10-19T00:00:00+08:00");

test("the movie code lasts until the next Beijing Monday", async () => {
  assert.equal(shanghaiWeekStart(mondayNoon), "2026-10-12");
  assert.equal(shanghaiWeekStart(sundayNight), "2026-10-12");
  assert.equal(shanghaiWeekEnd(sundayNight), nextMonday);

  const code = await movieAccessCodeForWeek("2026-10-12");
  assert.match(code, /^\d{4}$/);
  assert.notEqual(code, await accessCodeForDay("2026-10-12"));
  assert.equal(await verifyMovieAccessCode(code, mondayNoon), nextMonday);
  assert.equal(await verifyMovieAccessCode(` ${code} `, sundayNight), nextMonday);
  assert.equal(await verifyMovieAccessCode(code, nextMonday), null);

  const nextCode = await movieAccessCodeForWeek(shanghaiWeekStart(nextMonday));
  assert.notEqual(nextCode, code);
  assert.equal(await verifyMovieAccessCode(nextCode, nextMonday), Date.parse("2026-10-26T00:00:00+08:00"));
  assert.equal(await verifyMovieAccessCode("12", mondayNoon), null);
});
