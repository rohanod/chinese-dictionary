import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/translate/${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-4">
      <h1 className="text-3xl font-bold">Mandarin Dictionary</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md flex gap-2">
        <input
          className="flex-1 border rounded p-2"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by pinyin, hanzi or English"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Search
        </button>
      </form>
    </div>
  );
}
