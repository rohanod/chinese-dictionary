import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const controller = new AbortController();
    fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal })
      .then(res => res.json())
      .then(setResults)
      .catch(() => {});
    return () => controller.abort();
  }, [query]);

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search Hanzi, Pinyin or English"
      />
      <ul>
        {results.map((r, idx) => (
          <li key={idx}>
            <Link to={`/character/${encodeURIComponent(r.simplified)}`}>{r.simplified} - {r.english.join('; ')}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
