import { movieAccessCodeForWeek, shanghaiWeekEnd, shanghaiWeekStart } from "../src/lib/movie-access.ts";

const now = Date.now();
const code = await movieAccessCodeForWeek(shanghaiWeekStart(now));
const until = new Date(shanghaiWeekEnd(now)).toLocaleString("zh-CN", {
  timeZone: "Asia/Shanghai",
  hour12: false,
});

console.log(code);
console.log(`有效至北京时间 ${until}（下周一 0 点）`);
console.log("这是喜剧之王的测试码。把这 4 位数字发给对方。过了本周再打开，需要新的测试码。");
