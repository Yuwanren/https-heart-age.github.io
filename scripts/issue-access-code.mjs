import { accessCodeForDay, shanghaiDay, shanghaiDayEnd } from "../src/lib/access.ts";

const now = Date.now();
const code = await accessCodeForDay(shanghaiDay(now));
const until = new Date(shanghaiDayEnd(now)).toLocaleString("zh-CN", {
  timeZone: "Asia/Shanghai",
  hour12: false,
});

console.log(code);
console.log(`有效至北京时间 ${until}（当天 24:00）`);
console.log("把这 4 位数字发给对方。过了今天再打开，需要新的测试码。");
