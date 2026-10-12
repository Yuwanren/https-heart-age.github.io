import assert from "node:assert/strict";
import { generateKeyPairSync, sign } from "node:crypto";
import test from "node:test";
import { verifyAccessCode } from "@/lib/access";

function issue(exp: number, privateKey: ReturnType<typeof generateKeyPairSync>["privateKey"]) {
  const signature = sign("sha256", Buffer.from(String(exp)), { key: privateKey, dsaEncoding: "ieee-p1363" });
  return `${exp}.${signature.toString("base64url")}`;
}

test("an access code is valid only until its expiry", async () => {
  const { publicKey, privateKey } = generateKeyPairSync("ec", { namedCurve: "P-256" });
  const spki = publicKey.export({ type: "spki", format: "der" }).toString("base64");
  const exp = Date.now() + 60_000;
  const code = issue(exp, privateKey);

  assert.equal(await verifyAccessCode(code, exp - 1, spki), exp);
  assert.equal(await verifyAccessCode(`  ${code}  `, exp - 1, spki), exp);
  assert.equal(await verifyAccessCode(code, exp, spki), null);
  assert.equal(await verifyAccessCode(code, exp + 1, spki), null);
});

test("a changed access code is rejected", async () => {
  const { publicKey, privateKey } = generateKeyPairSync("ec", { namedCurve: "P-256" });
  const spki = publicKey.export({ type: "spki", format: "der" }).toString("base64");
  const code = issue(Date.now() + 60_000, privateKey);
  const [expText, signature] = code.split(".");
  const brokenExp = `${Number(expText) + 1}.${signature}`;
  const flipped = signature[8] === "A" ? "B" : "A";
  const brokenSig = `${expText}.${signature.slice(0, 8)}${flipped}${signature.slice(9)}`;

  assert.equal(await verifyAccessCode(brokenExp, Date.now(), spki), null);
  assert.equal(await verifyAccessCode(brokenSig, Date.now(), spki), null);
  assert.equal(await verifyAccessCode("123", Date.now(), spki), null);
  assert.equal(await verifyAccessCode("", Date.now(), spki), null);
});
