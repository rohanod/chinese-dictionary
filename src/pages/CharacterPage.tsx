import { useParams, Link } from 'react-router-dom';
import sampleData from '../utils/sampleData';

export default function CharacterPage() {
  const { id } = useParams();
  const data = sampleData.find((e) => e.id === id);

  if (!data) {
    return (
      <div className="p-4">
        <p>Character not found.</p>
        <Link to="/" className="text-blue-500 underline">Back</Link>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-2">
      <Link to="/" className="text-blue-500 underline">Back</Link>
      <h2 className="text-2xl font-bold">{data.hanzi}</h2>
      <img src={data.images.static} alt={data.hanzi} className="w-32 h-32" />
      <p>{data.pinyin}</p>
      <p>{data.english}</p>
      <p className="italic">Literal: {data.literal}</p>
      <div>
        <h3 className="font-bold">Radicals</h3>
        <ul className="list-disc list-inside">
          {data.radicals.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-bold">Example</h3>
        <p>{data.example}</p>
      </div>
    </div>
  );
}
