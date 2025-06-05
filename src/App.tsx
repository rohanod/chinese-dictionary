import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TranslatePage from './pages/TranslatePage';
import CharacterPage from './pages/CharacterPage';
import ChatPage from './pages/ChatPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/translate/:query" element={<TranslatePage />} />
        <Route path="/characters/:id" element={<CharacterPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  );
}
