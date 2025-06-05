export interface Entry {
  hanzi: string;
  pinyin: string;
  english: string;
  literal?: string;
  usage?: string;
}

export const dictionary: Entry[] = [
  {
    hanzi: "你好",
    pinyin: "nǐ hǎo",
    english: "hello",
    literal: "you good",
  },
  {
    hanzi: "学习",
    pinyin: "xué xí",
    english: "study",
  },
  {
    hanzi: "人",
    pinyin: "rén",
    english: "person",
  },
];
