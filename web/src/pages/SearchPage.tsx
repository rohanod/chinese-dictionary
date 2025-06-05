import { useState } from 'react';
import { Link } from 'react-router-dom';
import { search } from '../lib/search';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const results = search(query);
  return (
    <div>
      <p><Link to="/chat">Chat with AI</Link></p>
      <h1>Chinese Dictionary</h1>
      <input
        placeholder="Search hanzi, pinyin or english"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul>
        {results.map((entry) => (
          <li key={entry.hanzi}>
            <Link to={`/entry/${entry.hanzi}`}>{entry.hanzi} - {entry.pinyin} - {entry.english}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
