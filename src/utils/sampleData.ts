interface Entry {
  id: string;
  hanzi: string;
  pinyin: string;
  english: string;
  literal: string;
  images: {
    static: string;
  };
  radicals: string[];
  example: string;
}

const data: Entry[] = [
  {
    id: '1',
    hanzi: '你好',
    pinyin: 'ni3 hao3',
    english: 'hello',
    literal: 'you good',
    images: { static: '/placeholder.png' },
    radicals: ['亻', '女'],
    example: '你好！很高兴认识你。',
  },
  {
    id: '2',
    hanzi: '谢谢',
    pinyin: 'xie4 xie4',
    english: 'thank you',
    literal: 'thanks',
    images: { static: '/placeholder.png' },
    radicals: ['讠', '寸'],
    example: '谢谢你的帮助。',
  },
];

export default data;
