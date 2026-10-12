import assert from "node:assert/strict";
import test from "node:test";
import { accessCodeForDay, shanghaiDay, verifyAccessCode } from "@/lib/access";

const noon = Date.parse("2026-10-12T12:00:00+08:00");
const nextMidnight = Date.parse("2026-10-13T00:00:00+08:00");

test("the daily access code is four digits and stays the same all day", async () => {
  const code = await accessCodeForDay(shanghaiDay(noon));

  assert.match(code, /^\d{4}$/);
  assert.equal(await verifyAccessCode(code, noon), nextMidnight);
  assert.equal(await verifyAccessCode(`  ${code}  `, Date.parse("2026-10-12T23:59:59+08:00")), nextMidnight);
  assert.equal(await accessCodeForDay(shanghaiDay(noon)), code);
});

test("a code stops working at the next Beijing midnight", async () => {
  const code = await accessCodeForDay("2026-10-12");
  const tomorrow = await accessCodeForDay("2026-10-13");

  assert.notEqual(code, tomorrow);
  assert.equal(await verifyAccessCode(code, nextMidnight), null);
  assert.equal(await verifyAccessCode(tomorrow, nextMidnight), Date.parse("2026-10-14T00:00:00+08:00"));
  assert.equal(await verifyAccessCode("0000", noon), null);
  assert.equal(await verifyAccessCode("12345", noon), null);
  assert.equal(await verifyAccessCode("", noon), null);
});
