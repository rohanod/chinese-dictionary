import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      const go = () => navigate(`/search/${encodeURIComponent(query.trim())}`);
      if (document.startViewTransition) {
        document.startViewTransition(go);
      } else {
        go();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
      <input
        type="text"
        value={query}
        placeholder="Search in English, Pinyin or Hanzi"
        onChange={(e) => setQuery(e.target.value)}
        style={{ flex: 1 }}
      />
      <button type="submit">Search</button>
    </form>
  );
}
