import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ViewTransitionLink from './components/ViewTransitionLink';
import SearchBar from './components/SearchBar';
import SearchResults from './pages/SearchResults';
import EntryPage from './pages/EntryPage';
import ChatBot from './pages/ChatBot';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <header style={{ padding: '1rem', borderBottom: '1px solid #ccc', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}><ViewTransitionLink to="/" style={{ textDecoration: 'none' }}>Chinese Dictionary</ViewTransitionLink></h1>
        <nav>
          <ViewTransitionLink to="/chat">Chat</ViewTransitionLink>
        </nav>
      </header>
      <main style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<SearchBar />} />
          <Route path="/search/:query" element={<SearchResults />} />
          <Route path="/entry/:hanzi" element={<EntryPage />} />
          <Route path="/chat" element={<ChatBot />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
