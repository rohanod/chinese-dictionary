import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import EntryPage from './pages/EntryPage';
import Chatbot from './pages/Chatbot';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/chat" element={<Chatbot />} />
        <Route path="/" element={<SearchPage />} />
        <Route path="/entry/:hanzi" element={<EntryPage />} />
      </Routes>
    </BrowserRouter>
  );
}
