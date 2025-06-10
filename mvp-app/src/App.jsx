import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import HanziWriter from 'hanzi-writer'
import dictionary from './dictionary'
import './App.css'

function fuzzyPinyin(text) {
  return text.replace(/[0-9]/g, '').toLowerCase()
}

function SearchPage() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const results = dictionary.filter(entry => {
    if (!query) return false
    const q = query.trim().toLowerCase()
    return (
      entry.hanzi.includes(q) ||
      entry.english.toLowerCase().includes(q) ||
      fuzzyPinyin(entry.pinyin).includes(fuzzyPinyin(q))
    )
  })
  return (
    <div>
      <h1>Dictionary Search</h1>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by hanzi, pinyin or english" />
      <ul>
        {results.map(r => (
          <li key={r.hanzi}>
            <button onClick={() => navigate(`/entry/${encodeURIComponent(r.hanzi)}`)}>{r.hanzi} - {r.english}</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function TranslatePage() {
  const { text } = useParams()
  const parts = decodeURIComponent(text || '').split('')
  const entries = parts.map(ch => dictionary.find(e => e.hanzi === ch)).filter(Boolean)
  return (
    <div>
      <h1>Translation</h1>
      <div>
        {entries.map(e => (
          <div key={e.hanzi}>
            <Link to={`/entry/${encodeURIComponent(e.hanzi)}`}>{e.hanzi}</Link> - {e.english}
          </div>
        ))}
      </div>
    </div>
  )
}

function EntryPage() {
  const { hanzi } = useParams()
  const entry = dictionary.find(e => e.hanzi === decodeURIComponent(hanzi))
  const divRef = useRef(null)
  useEffect(() => {
    if (divRef.current && entry) {
      const writer = HanziWriter.create(divRef.current, entry.hanzi, { width: 100, height: 100 })
      writer.loopCharacterAnimation()
    }
  }, [entry])
  if (!entry) return <p>Entry not found</p>
  return (
    <div>
      <h1>{entry.hanzi}</h1>
      <div ref={divRef}></div>
      <p>Pinyin: {entry.pinyin}</p>
      <p>English: {entry.english}</p>
      <p>Literal: {entry.literal}</p>
      <h3>Examples</h3>
      <ul>{entry.examples.map(ex => <li key={ex}>{ex}</li>)}</ul>
      <button onClick={() => addToList('learning', entry.hanzi)}>Add to learning</button>
      <button onClick={() => addToList('learned', entry.hanzi)}>Add to learned</button>
    </div>
  )
}

function getList(name) {
  return JSON.parse(localStorage.getItem(name) || '[]')
}

function addToList(name, item) {
  const list = getList(name)
  if (!list.includes(item)) {
    localStorage.setItem(name, JSON.stringify([...list, item]))
  }
}

function ListsPage() {
  const [learning, setLearning] = useState(getList('learning'))
  const [learned, setLearned] = useState(getList('learned'))
  return (
    <div>
      <h1>Your Lists</h1>
      <h2>Learning</h2>
      <ul>{learning.map(h => <li key={h}><Link to={`/entry/${encodeURIComponent(h)}`}>{h}</Link></li>)}</ul>
      <h2>Learned</h2>
      <ul>{learned.map(h => <li key={h}><Link to={`/entry/${encodeURIComponent(h)}`}>{h}</Link></li>)}</ul>
    </div>
  )
}

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Search</Link> | <Link to="/lists">Lists</Link>
      </nav>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/translate/:text" element={<TranslatePage />} />
        <Route path="/entry/:hanzi" element={<EntryPage />} />
        <Route path="/lists" element={<ListsPage />} />
      </Routes>
    </Router>
  )
}

export default App
