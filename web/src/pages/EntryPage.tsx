import { useParams, Link } from 'react-router-dom';
import { dictionary } from '../data/dictionary';

export default function EntryPage() {
  const { hanzi } = useParams<{ hanzi: string }>();
  const entry = dictionary.find((e) => e.hanzi === hanzi);
  if (!entry) {
    return (
      <div>
        <p>Entry not found.</p>
        <Link to="/">Back to search</Link>
      </div>
    );
  }
  return (
    <div>
      <Link to="/">Back</Link>
      <h2>{entry.hanzi}</h2>
      <p>Pinyin: {entry.pinyin}</p>
      <p>English: {entry.english}</p>
      {entry.literal && <p>Literal: {entry.literal}</p>}
    </div>
  );
}
