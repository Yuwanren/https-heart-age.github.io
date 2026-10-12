import { sign } from "node:crypto";
import { readFileSync } from "node:fs";

const DAY_MS = 24 * 60 * 60 * 1000;
const privateKey = readFileSync(new URL("../access-private.pem", import.meta.url), "utf8");
const exp = Date.now() + DAY_MS;
const signature = sign("sha256", Buffer.from(String(exp)), {
  key: privateKey,
  dsaEncoding: "ieee-p1363",
});
const code = `${exp}.${signature.toString("base64url")}`;
const until = new Date(exp).toLocaleString("zh-CN", { hour12: false });

console.log(code);
console.log(`有效至 ${until}`);
console.log("把上面的测试码发给对方。24 小时后再次打开会失效。");
