import { useState } from 'react';
import data from '../data/dictionary.json';
import { Link } from 'react-router-dom';

function normalizePinyin(pinyin) {
  return pinyin.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}

export default function Search() {
  const [query, setQuery] = useState('');
  const results = data.filter(entry => {
    const q = query.trim().toLowerCase();
    if (!q) return false;
    return (
      entry.hanzi.includes(q) ||
      entry.english.toLowerCase().includes(q) ||
      normalizePinyin(entry.pinyin).includes(normalizePinyin(q))
    );
  });

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search Hanzi, Pinyin or English"
      />
      <ul>
        {results.map(r => (
          <li key={r.hanzi}>
            <Link to={`/character/${encodeURIComponent(r.hanzi)}`}>{r.hanzi} - {r.english}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
