import { dictionary } from '../data/dictionary';
import type { Entry } from '../data/dictionary';
import { pinyin } from 'pinyin-pro';

function normalizePinyin(input: string): string {
  return pinyin(input, { toneType: 'none' })
    .replace(/\s+/g, '')
    .toLowerCase();
}

export function search(query: string): Entry[] {
  const hanziRegex = /[\u3400-\u9FBF]/;
  query = query.trim();
  if (!query) return [];
  if (hanziRegex.test(query)) {
    return dictionary.filter((e) => e.hanzi.includes(query));
  }
  const q = query.toLowerCase();
  const englishMatches = dictionary.filter((e) => e.english.toLowerCase().includes(q));
  const qNorm = normalizePinyin(q);
  const pinyinMatches = dictionary.filter((e) =>
    normalizePinyin(e.pinyin).includes(qNorm)
  );
  const set = new Set<Entry>([...englishMatches, ...pinyinMatches]);
  return Array.from(set);
}
