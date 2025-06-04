import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { entries } from './data/dictionary.js';
import { normalizePinyin } from './utils/pinyin.js';
import HanziWriter from 'hanzi-writer';
import { useEffect, useRef } from 'react';
import Chat from './components/Chat.jsx';

function useViewNavigate() {
  const navigate = useNavigate();
  return (path) => {
    if (document.startViewTransition) {
      document.startViewTransition(() => navigate(path));
    } else {
      navigate(path);
    }
  };
}

function SearchPage() {
  const [query, setQuery] = useState('');
  const navigate = useViewNavigate();

  const results = entries.filter(e => {
    const q = query.trim();
    if (!q) return false;
    if (e.hanzi === q) return true;
    if (normalizePinyin(e.pinyin).includes(normalizePinyin(q))) return true;
    if (e.english.toLowerCase().includes(q.toLowerCase())) return true;
    return false;
  });

  return (
    <div>
      <h1>Chinese Dictionary</h1>
      <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search" />
      <ul>
        {results.map(e => (
          <li key={e.hanzi}>
            <button onClick={()=>navigate(`/entry/${encodeURIComponent(e.hanzi)}`)}>
              {e.hanzi} - {e.pinyin} - {e.english}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function EntryPage({hanzi}) {
  const entry = entries.find(e=>e.hanzi===hanzi);
  const container = useRef(null);
  useEffect(()=>{
    if (container.current && entry) {
      container.current.innerHTML='';
      HanziWriter.create(container.current, entry.hanzi, {width:100,height:100});
    }
  },[hanzi, entry]);

  if (!entry) return <div>Not found</div>;

  return (
    <div>
      <h1>{entry.hanzi}</h1>
      <div ref={container}></div>
      <p>Pinyin: {entry.pinyin}</p>
      <p>English: {entry.english}</p>
      <p>Literal: {entry.literal}</p>
      <p>Frequency: {entry.frequency}</p>
      <h2>Examples</h2>
      <ul>{entry.examples.map((ex,i)=>(<li key={i}>{ex}</li>))}</ul>
      <h2>Radicals</h2>
      <ul>
        {entry.radicals.map(r => (
          <li key={r}>
            <Link to={`/entry/${encodeURIComponent(r)}`}>{r}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TranslatePage({phrase}) {
  const navigate = useViewNavigate();
  const match = entries.find(e=>e.hanzi===phrase||normalizePinyin(e.pinyin)===normalizePinyin(phrase)||e.english.toLowerCase()===phrase.toLowerCase());
  if (match) {
    navigate(`/entry/${encodeURIComponent(match.hanzi)}`);
    return null;
  }
  return <div>No translation found</div>;
}

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<SearchPage />} />
      <Route path="/entry/:hanzi" element={<EntryWrapper />} />
      <Route path="/translate/:phrase" element={<TranslateWrapper />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  );
}

function EntryWrapper() {
  const { hanzi } = useParams();
  return <EntryPage hanzi={decodeURIComponent(hanzi)} />;
}
function TranslateWrapper() {
  const { phrase } = useParams();
  return <TranslatePage phrase={decodeURIComponent(phrase)} />;
}

export default function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link> | <Link to="/chat">Chat</Link>
      </nav>
      <AppRouter />
    </Router>
  );
}
