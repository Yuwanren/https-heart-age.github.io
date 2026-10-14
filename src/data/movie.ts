export const CHARACTER_IDS = ["yin", "liu", "du", "hong", "lunch", "frog"] as const;

export type CharacterId = (typeof CHARACTER_IDS)[number];
export type MovieOptionId = "A" | "B" | "C" | "D";

export interface MovieCharacter {
  id: CharacterId;
  name: string;
  line: string;
  reading: string;
  limit: string;
}

export const CHARACTERS: MovieCharacter[] = [
  {
    id: "yin",
    name: "尹天仇",
    line: "其实我是一个演员。",
    reading: "再小的角色，你也想演完。别人已经喊停了，你还在想这个人该怎么倒下。像他，是因为你不肯承认自己只是个跑龙套的。",
    limit: "你会把演戏看得比吃饭更要紧。不是谁都欠你一个主角。",
  },
  {
    id: "liu",
    name: "柳飘飘",
    line: "不上班你养我啊？",
    reading: "你先算日子过不过得去，再谈喜不喜欢。像她，是因为你不会拿演戏当借口，躲开今晚这顿饭。",
    limit: "算得太清楚的时候，「我养你啊」听起来就像一句还没兑现的话。",
  },
  {
    id: "du",
    name: "杜娟儿",
    line: "",
    reading: "你站在镜头对着的地方，也习惯把别人往中间带。这场戏换不换人，你看得懂，也说得上话。像她，是因为机会要经过你。",
    limit: "别人会记得你给过的位置，也会记得这个位置本来就是你的。",
  },
  {
    id: "hong",
    name: "洪爷",
    line: "",
    reading: "这间屋子谁说了算，你心里有数。话不必大声，面子也不是吵出来的。人还没进门，你已经知道这件事算不算数。",
    limit: "别人的认真，有时在你看来只是不识趣。",
  },
  {
    id: "lunch",
    name: "派饭的达叔",
    line: "我不会 NG。",
    reading: "你表面上在数盒饭，其实在看谁演得太用力。像他，是因为你天天都在演，只是手里没有剧本。一旦出错，就不能重来。",
    limit: "看多了以后，太认真的人也会被你当成又一个来领盒饭的。",
  },
  {
    id: "frog",
    name: "田鸡",
    line: "",
    reading: "做主的不是你。上面的人还没点头，你已经站在门口。像他，是因为你把吩咐听完整，再原样做完。",
    limit: "你很少把这件事当成自己的。也许还没轮到你做主。",
  },
];

export interface MovieOption {
  id: MovieOptionId;
  text: string;
  character: CharacterId;
}

export interface MovieQuestion {
  id: number;
  scene: string;
  prompt: string;
  options: MovieOption[];
}

export const MOVIE_QUESTIONS: MovieQuestion[] = [
  {
    id: 1,
    scene: "片场",
    prompt: "你演的龙套一出场就被打死，一句台词也没有。有人朝你喊：能不能有点专业精神。盒饭还没到，摄影已经在催下一场。这时你怎么做？",
    options: [
      { id: "A", character: "yin", text: "你继续躺着。没人喊停，这个死你就演到底，嘴里还是那句：其实我是一个演员。" },
      { id: "B", character: "hong", text: "你看都不看他。这种话轮不到龙套喊，这里谁说了算，谁才配谈专业。" },
      { id: "C", character: "lunch", text: "你放下这场戏，去点盒饭的数目。喊归喊，饭还是要数清楚。" },
      { id: "D", character: "frog", text: "你站在原地，一句话不回。上面的人没发话，你就不动。" },
    ],
  },
  {
    id: 2,
    scene: "福利会",
    prompt: "街坊福利会的训练班今晚几乎没人。椅子空着，《雷雨》的剧本摊在桌上。门外有人看了一眼就走了。你怎么办？",
    options: [
      { id: "A", character: "yin", text: "你照样把这场排完。没人看也没关系。你早就对着海喊过：努力！奋斗！" },
      { id: "B", character: "liu", text: "你不是来陪空场子的。要学，就学一段用得上的，学完得能过上另一种日子。空成这样，你就走。" },
      { id: "C", character: "du", text: "你不会留下来。你要是在，这间屋子不会这么空。人不来，多半是海报上没有你的名字。" },
      { id: "D", character: "lunch", text: "你把多出来的盒饭放在门口，不评价这场戏好不好。空场子你见得太多了。" },
    ],
  },
  {
    id: 3,
    scene: "马路",
    prompt: "马路上风很大。一个人问：不上班行不行。另一个人回：不上班你养我啊，说完往前走了两步。换成你，你站哪边？",
    options: [
      { id: "A", character: "yin", text: "你站问的那边。你追上去说：我养你啊。自己还没站稳，话先说了出去。" },
      { id: "B", character: "liu", text: "你站回的那边。「不上班你养我啊」是你说的。你也听得进后面那句：你先照顾好你自己吧。" },
      { id: "C", character: "du", text: "你哪边都不站。这种话轮不到你。你不用人养，也不会靠一句承诺过日子。" },
      { id: "D", character: "hong", text: "你先看这两人各站哪边。养不养是一笔账。这笔账不值得接，你就不接。" },
    ],
  },
  {
    id: 4,
    scene: "片场",
    prompt: "男主角临时换人。通知贴出来时你就在现场，旧名字被划掉，新名字还空着，周围已经在改机位。你怎么做？",
    options: [
      { id: "A", character: "liu", text: "你问这个空位自己能不能顶上。先问清有多少戏，再问今晚你还在不在这场戏里。" },
      { id: "B", character: "du", text: "换谁上，你说得上话。你看中谁，谁才走得到镜头中间。" },
      { id: "C", character: "hong", text: "谁上谁下，最好事先告诉你。没人告诉你，这个面子也不能落下，你会让人把话说清楚。" },
      { id: "D", character: "lunch", text: "通知你看见了，人你不换。你照旧去派饭。主角换了几轮，盒饭的份数你心里有数。" },
    ],
  },
  {
    id: 5,
    scene: "死尸",
    prompt: "演死尸的人还躺在画好的位置上，跟导演说：再等一会我就死了，而且死定了。周围已经开始收器材。换成你，你怎么做？",
    options: [
      { id: "A", character: "yin", text: "你会说这句话。死也要先想好这个人是怎么死的。没喊停之前，尸体也不出戏。" },
      { id: "B", character: "du", text: "这种角色你不会接。你要别人记住的是那张脸，不是一块躺着的布景。" },
      { id: "C", character: "hong", text: "让你躺着，你就躺着。还想加戏，就是不识趣。" },
      { id: "D", character: "lunch", text: "你把盒饭放在尸体旁边，说：吃完再死。戏可以是假的，饭点是真的。" },
    ],
  },
  {
    id: 6,
    scene: "夜店",
    prompt: "夜店里灯光很暗，有人要你陪一句酒令。你知道这不是排练，对方却看着你，等你接话。你怎么接？",
    options: [
      { id: "A", character: "yin", text: "你把酒令当成一场戏来接，接完还补一句：其实我是一个演员。" },
      { id: "B", character: "liu", text: "你划拳、陪笑，把这桌应付过去。你清楚这是今晚的工作，不是兴趣班。" },
      { id: "C", character: "hong", text: "这桌谁能坐、谁该走，你点一下就够。酒令只是个由头，你不必自己下场。" },
      { id: "D", character: "lunch", text: "你把这句酒令接完。你听得出谁在演戏、谁在过日子。你自己也天天在演，只是不会 NG。" },
    ],
  },
  {
    id: 7,
    scene: "传话",
    prompt: "有句话传过来：人现在过去。没有原因，只有一个时间。去晚了，就等于没有这个人。这句话跟你有关，你怎么处理？",
    options: [
      { id: "A", character: "yin", text: "你先在心里把人物关系过一遍，再抬脚。连出门都想先排成一场戏。" },
      { id: "B", character: "du", text: "你让人回一句：档期再看。你不是招之即来的人。" },
      { id: "C", character: "hong", text: "你不跟着这个时间走。人来不来，你心里有数。这种话该由你来说，不该由别人来催你。" },
      { id: "D", character: "frog", text: "你已经等在门口。说走就走，不多问这一趟是为什么。" },
    ],
  },
  {
    id: 8,
    scene: "当面",
    prompt: "有人当众喊你「跑龙套的」，前面还加了个「臭」字。有人在笑，也有人在等你接不接。你怎么接？",
    options: [
      { id: "A", character: "yin", text: "你可以叫我跑龙套的，不能叫我臭跑龙套的。临时演员也是演员。" },
      { id: "B", character: "liu", text: "你不跟他争这个称呼。你只问：今晚这场，还值不值得留下来。" },
      { id: "C", character: "du", text: "这种话一般落不到你头上。真落到了，会有人先替你把场面压下去，你不必自己开口。" },
      { id: "D", character: "frog", text: "你先看上面的人笑不笑。他笑，你就跟着笑；他不笑，你把那人的杯子挪开。" },
    ],
  },
  {
    id: 9,
    scene: "盒饭",
    prompt: "开饭了。派饭的人把盒饭拍在一个人面前，说他不配领三盒。队伍还很长，后面的人都在看。换成你，你怎么做？",
    options: [
      { id: "A", character: "yin", text: "被说不配的人要是你，这三盒你还是要拿回来。" },
      { id: "B", character: "du", text: "你不排这条队。该送到你面前的，不会跟龙套挤在同一个箱子里。" },
      { id: "C", character: "lunch", text: "这句话就是你说的。你见过太多次把龙套演成主角的人。" },
      { id: "D", character: "frog", text: "你帮着把饭箱抬过去，不多嘴。谁领几盒，没人叫你管。" },
    ],
  },
  {
    id: 10,
    scene: "换角",
    prompt: "说好的主角，开拍前又换了人。人物小传写到半夜，服装还挂在原来的名字下面。这件事落到你头上，你怎么做？",
    options: [
      { id: "A", character: "yin", text: "被换下来的要是你，角色没了，准备还在。你把小传收好，下一场也许用得上。" },
      { id: "B", character: "liu", text: "你问下一场还有没有你的位置。当不了主角，有一句台词也比干等强。" },
      { id: "C", character: "hong", text: "这种换法要是没人提前告诉你，你会让人回来解释清楚。" },
      { id: "D", character: "frog", text: "你去通知那个被换下来的人。话不好听，你也照说。" },
    ],
  },
  {
    id: 11,
    scene: "看中",
    prompt: "片场上有人看了旁边的人一眼，说：这场可以让你来。周围安静了一下。这种眼神不是天天都有。你怎么接？",
    options: [
      { id: "A", character: "liu", text: "被看的人要是你，你先确认这是不是真的，再说自己准备了多久。这种机会你见过，不是每次都能留下。" },
      { id: "B", character: "du", text: "看的人就是你。你看一眼，就能让人上台。这是你的习惯，不是临时起意。" },
      { id: "C", character: "hong", text: "大明星开了口，你也得点头。不然这件事还不算数。" },
      { id: "D", character: "frog", text: "你在旁边听完，回头一字不落地转告。你不添，也不漏。" },
    ],
  },
  {
    id: 12,
    scene: "念书",
    prompt: "福利会里有人把《演员自我修养》读得很响。窗外是收工的声音，屋里只有这本翻旧了的书。你正好在，你怎么做？",
    options: [
      { id: "A", character: "liu", text: "你坐下来听一段。用得上的你拿走，用不上的你不装懂。" },
      { id: "B", character: "du", text: "你不跟着读。这本书你也许翻过，你现在更在意自己在镜头里是什么样子。" },
      { id: "C", character: "lunch", text: "你端着饭从门口经过。读书声你听见了，脚步没有停。" },
      { id: "D", character: "frog", text: "你听不太懂，也就不接话。这种时候少说话，比多懂两句更有用。" },
    ],
  },
  {
    id: 13,
    scene: "收工",
    prompt: "收工了。有人约你去吃宵夜，有人把明天的台词塞过来。灯一盏盏灭掉，人还没走完。你怎么做？",
    options: [
      { id: "A", character: "yin", text: "你留下来对词。宵夜可以不吃，明天这场不能什么都不准备就上场。" },
      { id: "B", character: "liu", text: "你去吃宵夜。空着肚子谈演戏，你试过，解决不了今晚。" },
      { id: "C", character: "lunch", text: "宵夜和台词你都不接。你把剩下的盒饭锁好，再数一遍明天还差几份。" },
      { id: "D", character: "frog", text: "你等该等的人先走。他没发话，宵夜你不去，台词你也不先接。" },
    ],
  },
  {
    id: 14,
    scene: "一叠钱",
    prompt: "桌上放着一叠钱，没人解释这是什么意思。灯还亮着，对方看着你，等你是先伸手，还是先开口。你怎么做？",
    options: [
      { id: "A", character: "liu", text: "你先点清楚，再决定收不收。钱是什么意思你懂，人是什么意思也要问明白。" },
      { id: "B", character: "hong", text: "钱是你让人放上去的。你不必解释，一解释就小了。" },
      { id: "C", character: "lunch", text: "你当作没看见。就算看见了，也只当是道具，拍完就要收回去。" },
      { id: "D", character: "frog", text: "你把钱推到该拿的人面前，自己不碰。" },
    ],
  },
  {
    id: 15,
    scene: "没主角",
    prompt: "片场乱起来了，主角不在。机位还在，人也在，只是中间空着。大家都在等一句能让场面停下来的话。你怎么做？",
    options: [
      { id: "A", character: "du", text: "你走到中间去。没有你，他们也会硬着头皮拍完。你知道这一点，所以更要把这个空补上。" },
      { id: "B", character: "hong", text: "主角不在，正好。你要看看这班人还听不听你的。" },
      { id: "C", character: "lunch", text: "你不去说那句话。你照旧一盒一盒地派饭。没有主角，开饭的时间也不会改。" },
      { id: "D", character: "frog", text: "你先去找该听的那个人。他不在，你就少说一句。" },
    ],
  },
];
