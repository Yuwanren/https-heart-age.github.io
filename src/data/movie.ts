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
    reading: "很小的角色你也想演完。别人已经喊卡了，你还在想这个人该怎么死、怎么站。像他，是因为你不肯把跑龙套说成自己的全部。",
    limit: "认真会盖过盒饭。不是所有人都欠你一个主角。",
  },
  {
    id: "liu",
    name: "柳飘飘",
    line: "不上班你养我啊？",
    reading: "你把日子算在前面。喜欢可以有，先问能不能过下去。像她，是因为你不拿一场戏去挡今晚的饭。",
    limit: "算得太清时，会把「我养你啊」听成一句还没着落的话。",
  },
  {
    id: "du",
    name: "杜娟儿",
    line: "",
    reading: "你站在镜头在的地方，也习惯让别人站过来。一场戏换不换人，你看得懂，也能说上话。像她，是因为机会经过你的手。",
    limit: "人会记得你让出的位置，也会记得位置本来就是你的。",
  },
  {
    id: "hong",
    name: "洪爷",
    line: "",
    reading: "这间屋子听谁的，你心里有数。话不用大声，面子不用吵出来。像他，是因为人还没进门，你已经知道这场算不算数。",
    limit: "别人的认真，有时在你这里只是不识相。",
  },
  {
    id: "lunch",
    name: "派饭的达叔",
    line: "我不会 NG。",
    reading: "你看起来在数盒饭，其实在看谁演得太用力。像他，是因为你天天都在演，只是手里没有剧本。一 NG，这场就没有第二次。",
    limit: "看穿太多次以后，认真的人在你嘴里会变成又一个领盒饭的。",
  },
  {
    id: "frog",
    name: "田鸡",
    line: "",
    reading: "拍板的不是你。洪爷的下巴还没动，你已经站到门口。像他，是因为你把别人的一句吩咐听完整，再原样做完。",
    limit: "你很少把场面算成自己的。算成自己的那一次，可能还没来。",
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
    prompt: "有人朝龙套喊：能不能有点专业精神。你手头这个角色出场就被打死，没有一句词。盒饭还没到点，摄影机已经在催下一场。",
    options: [
      { id: "A", character: "yin", text: "死也要死出个层次。导演没喊卡，你还躺着。心里那句还是：其实我是一个演员。" },
      { id: "B", character: "hong", text: "专业不专业，要看这场面谁说了算。轮不到一个龙套在这里谈戏。" },
      { id: "C", character: "lunch", text: "先把盒饭的数目点清。专业精神不能当饭，饭点到了，戏也得让一让。" },
      { id: "D", character: "frog", text: "你不接这句话。你站在该站的侧后方，等上面的人下巴动一下。" },
    ],
  },
  {
    id: 2,
    scene: "福利会",
    prompt: "街坊福利会的训练班今晚几乎没人。椅子空着，你还是把《雷雨》的页码摊开。门外有人路过，看了一眼又走了。",
    options: [
      { id: "A", character: "yin", text: "有没有观众是另一件事。你把这场排完。对着海也喊过：努力！奋斗！" },
      { id: "B", character: "liu", text: "你来是想学一段用得上的，不是陪一个空场子。学完，得能换成另一种日子。" },
      { id: "C", character: "du", text: "你要是坐在这里，这间屋不会空。人不来，多半是因为海报上没有你的名字。" },
      { id: "D", character: "lunch", text: "你把多出来的盒饭放在门口，不评价这场戏好不好。戏演给谁看，你见得太多。" },
    ],
  },
  {
    id: 3,
    scene: "马路",
    prompt: "有人问你：不上班行不行。下一句是「不上班你养我啊」。风很大，对方已经朝前走了两步。",
    options: [
      { id: "A", character: "yin", text: "你追上去，把那句说出来：我养你啊。自己还没站稳，话先到了。" },
      { id: "B", character: "liu", text: "这句是你问的。你也听得进后头那句：你先照顾好你自己吧。" },
      { id: "C", character: "du", text: "你不用人养。你要是开口，是把一个角色交出去，不是把日子交出去。" },
      { id: "D", character: "hong", text: "养不养是一笔账。你先看这个人站在哪一边，再决定这句话值不值得接。" },
    ],
  },
  {
    id: 4,
    scene: "片场",
    prompt: "男主角临时换人。通知贴出来的时候，你就在现场。旧的名字被划掉，新的名字还空着，周围的人已经开始改机位。",
    options: [
      { id: "A", character: "liu", text: "你问这个空出来的位置自己能不能顶。先问清戏份，再问这晚还在不在。" },
      { id: "B", character: "du", text: "换人你参得上。你看中谁，谁才有机会走到镜头中间。" },
      { id: "C", character: "hong", text: "谁上谁下，最好事先有人告诉你。片场再大，这个面子也不该漏掉。" },
      { id: "D", character: "lunch", text: "你照旧派饭。主角换了几轮，盒饭还是那些盒饭，数目你心里有数。" },
    ],
  },
  {
    id: 5,
    scene: "死尸",
    prompt: "你的角色是一具死尸。导演说再等一会你就死了，而且死定了。周围的人已经在收线，你还躺在画好的位置上。",
    options: [
      { id: "A", character: "yin", text: "死也要先想好这个人怎么死。卡之前，尸体也不出戏。" },
      { id: "B", character: "du", text: "这种角色你不会接。你要被人记住的是那张脸，不是一块躺着的布景。" },
      { id: "C", character: "hong", text: "死尸就躺好。还有人想加戏，你觉得这是不识相。" },
      { id: "D", character: "lunch", text: "你把盒饭递到这具尸体旁边：吃完再死。戏可以假，饭点是真的。" },
    ],
  },
  {
    id: 6,
    scene: "夜店",
    prompt: "灯光很暗，有人要你陪一句酒令。你知道这不是排练，可对方看着你，像在等一个会接戏的人。",
    options: [
      { id: "A", character: "yin", text: "你把酒令当成一场戏来接，接完还补一句：其实我是一个演员。" },
      { id: "B", character: "liu", text: "划拳、陪笑、把这桌圆过去。你清楚这是今晚的工作，不是兴趣班。" },
      { id: "C", character: "hong", text: "这桌人谁能坐、谁该走，你点一下就够。酒令只是个由头。" },
      { id: "D", character: "lunch", text: "你听得出谁在演、谁在过日子。你自己也天天在演，只是不会 NG。" },
    ],
  },
  {
    id: 7,
    scene: "传话",
    prompt: "那边来了句话，要人现在过去。没有原因，只有一个时间。去晚了，这场就算你没听见。",
    options: [
      { id: "A", character: "yin", text: "你先在心里把人物关系过一遍，再抬脚。连出门也想排成一场戏。" },
      { id: "B", character: "du", text: "你让人回一句：档期看一看。你不是随传随到的那个。" },
      { id: "C", character: "hong", text: "这句话要是你放出去的，人来不来，你其实已经知道。" },
      { id: "D", character: "frog", text: "你已经在门口。说走就走，不多问这一趟是为了什么。" },
    ],
  },
  {
    id: 8,
    scene: "当面",
    prompt: "有人当众叫你跑龙套的，还在前面加了个很难听的字。周围有人笑，也有人在等你接不接。",
    options: [
      { id: "A", character: "yin", text: "你可以叫我跑龙套的，不能那么叫。临时演员也是演员。" },
      { id: "B", character: "liu", text: "你不跟他争名分。你只问：这个名分，今晚还值不值钱。" },
      { id: "C", character: "du", text: "这种话通常落不到你头上。真落到了，会有人先替你把场面按住。" },
      { id: "D", character: "frog", text: "你先看上面的人笑不笑。他笑，你就跟着；他不笑，你把那人的杯子挪开。" },
    ],
  },
  {
    id: 9,
    scene: "盒饭",
    prompt: "派饭的人把盒饭拍在你面前，说你不配拿三盒。队伍还长，后面的人已经在看你让不让。",
    options: [
      { id: "A", character: "yin", text: "你还是要拿回属于你的三盒。数目对不对另说，这是你的。" },
      { id: "B", character: "du", text: "你不在这条队伍里。该送到你面前的，不会跟龙套挤在一个箱子里。" },
      { id: "C", character: "lunch", text: "这句话就是你说的。你见过太多次，把一个龙套活演成主角的人。" },
      { id: "D", character: "frog", text: "你帮着把饭箱抬过去，不多嘴。谁领几盒，没人叫你管。" },
    ],
  },
  {
    id: 10,
    scene: "换角",
    prompt: "说好的主角，开拍前被换掉了。人物小传你已经写到半夜，服装还挂在你的名字下面。",
    options: [
      { id: "A", character: "yin", text: "角色没了，功课还在。你把小传收好，下一场也许用得上。" },
      { id: "B", character: "liu", text: "你问下一场还有没有位置。没有主角，有一句词也比干等强。" },
      { id: "C", character: "hong", text: "这种换法你要是事先不知道，你会让人回来解释清楚。" },
      { id: "D", character: "frog", text: "你去通知那个被换掉的人。话不好听，你也照着说完。" },
    ],
  },
  {
    id: 11,
    scene: "看中",
    prompt: "杜娟儿看了你一眼，说这场可以让你来。周围忽然安静了一点。你知道这种眼神不是每天都有。",
    options: [
      { id: "A", character: "liu", text: "你先确认这是不是真的，再说自己准备了多久。机会你见过，不是每次都留下。" },
      { id: "B", character: "du", text: "你就是那个看一眼、就能让人上来的人。这是你的习惯，不是临时起意。" },
      { id: "C", character: "hong", text: "大明星发话，你也要点头。不然这场面还不算数。" },
      { id: "D", character: "frog", text: "你在旁边听完，回头一字不差地转告。你不添，也不漏。" },
    ],
  },
  {
    id: 12,
    scene: "念书",
    prompt: "有人在福利会把《演员自我修养》读得很响。窗外是收工的声音，屋里只有这一本被翻旧的书。",
    options: [
      { id: "A", character: "liu", text: "你坐下听一段。用得上的你拿走，用不上的你不装懂。" },
      { id: "B", character: "du", text: "这本书你也许翻过。你现在更在意镜头把你留成什么样。" },
      { id: "C", character: "lunch", text: "你端着饭从门口经过，听见「努力！奋斗」，脚步没有停。" },
      { id: "D", character: "frog", text: "你听不太懂。你只知道，这种场合少出声，比多懂两句有用。" },
    ],
  },
  {
    id: 13,
    scene: "收工",
    prompt: "收工了。有人约宵夜，有人把明天的词又塞过来。灯一盏盏灭，片场只剩下箱子和还没走的人。",
    options: [
      { id: "A", character: "yin", text: "你留下对词。宵夜可以没有，明天那个角色不能虚。" },
      { id: "B", character: "liu", text: "你去吃。饿着谈演戏，你试过，不值钱。" },
      { id: "C", character: "lunch", text: "你把剩下的盒饭锁好，数一数明天还差几份。" },
      { id: "D", character: "frog", text: "你等该等的人先走。他筷子还没放，你也不好先出门口。" },
    ],
  },
  {
    id: 14,
    scene: "一叠钱",
    prompt: "桌上放着一叠钱。没人解释这是什么意思。灯还亮着，说话的人看着你，等你先碰还是先问。",
    options: [
      { id: "A", character: "liu", text: "你点清楚再决定收不收。钱的意思你懂，人的意思你也要问明白。" },
      { id: "B", character: "hong", text: "钱是你让人放上去的。不用解释，一解释就小了。" },
      { id: "C", character: "lunch", text: "你当没看见。看见了也只当道具，拍完得收回去。" },
      { id: "D", character: "frog", text: "你把钱推到该拿的人手里，自己不碰。" },
    ],
  },
  {
    id: 15,
    scene: "没主角",
    prompt: "片场乱起来的时候，主角不在。机位还在，人还在，只是中间那个位置空着。每个人都在等一句能让场面停下来的话。",
    options: [
      { id: "A", character: "du", text: "你不在的日子，他们也会硬拍。你知道，所以你更要在。" },
      { id: "B", character: "hong", text: "主角不在，正好。你看这班人还听不听你的。" },
      { id: "C", character: "lunch", text: "你一盒一盒派。没有主角，饭点也不会改。" },
      { id: "D", character: "frog", text: "你先找该听的那个人。他不在，你就少说一句。" },
    ],
  },
];
