import { useParams } from 'react-router-dom';
import data from '../sampleData';

export default function EntryPage() {
  const { hanzi } = useParams();
  const entry = data.find(d => d.hanzi === hanzi);

  if (!entry) {
    return <p>Entry not found.</p>;
  }

  return (
    <div>
      <h2>{entry.hanzi}</h2>
      <p>Pinyin: {entry.pinyin}</p>
      <p>English: {entry.english}</p>
      {/* Placeholder for images, stroke order, audio, etc */}
    </div>
  );
}
