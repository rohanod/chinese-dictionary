import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Search from './components/Search.jsx';
import CharacterPage from './components/CharacterPage.jsx';
import Translate from './components/Translate.jsx';
import Chatbot from './components/Chatbot.jsx';
import './App.css';

function ViewTransition({ children }) {
  const location = useLocation();
  useEffect(() => {
    if (document.startViewTransition) {
      document.startViewTransition(() => {});
    }
  }, [location]);
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <ViewTransition>
        <nav>
          <Link to="/">Search</Link> | <Link to="/translate">Translate</Link> |{' '}
          <Link to="/chat">Chat</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Search />} />
          <Route path="/translate" element={<Translate />} />
          <Route path="/chat" element={<Chatbot />} />
          <Route path="/character/:hanzi" element={<CharacterPage />} />
        </Routes>
      </ViewTransition>
    </BrowserRouter>
  );
}
