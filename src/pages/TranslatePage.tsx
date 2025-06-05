import { useParams, Link } from 'react-router-dom';
import sampleData from '../utils/sampleData';

export default function TranslatePage() {
  const { query } = useParams();
  const result = sampleData.find((entry) =>
    entry.hanzi === query ||
    entry.pinyin.replace(/[1-5]/g, '') === query?.toLowerCase() ||
    entry.english.toLowerCase() === query?.toLowerCase()
  );

  if (!result) {
    return (
      <div className="p-4">
        <p>No results found.</p>
        <Link to="/" className="text-blue-500 underline">Back</Link>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Link to="/" className="text-blue-500 underline">Back</Link>
      <h2 className="text-2xl font-bold mt-2">{result.hanzi}</h2>
      <p className="text-lg">{result.pinyin}</p>
      <p>{result.english}</p>
      <Link to={`/characters/${result.id}`} className="text-blue-500 underline mt-4 block">
        View Character Details
      </Link>
    </div>
  );
}
