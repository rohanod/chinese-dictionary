import { useParams } from 'react-router-dom';
import ViewTransitionLink from '../components/ViewTransitionLink';
import data from '../sampleData';

export default function SearchResults() {
  const { query } = useParams();
  const results = data.filter(item =>
    item.english.toLowerCase().includes(query.toLowerCase()) ||
    item.pinyin.replace(/\d/g, '').toLowerCase().includes(query.toLowerCase()) ||
    item.hanzi.includes(query)
  );

  if (results.length === 0) {
    return <p>No results found.</p>;
  }

  return (
    <ul>
      {results.map(r => (
        <li key={r.hanzi}>
          <ViewTransitionLink to={`/entry/${encodeURIComponent(r.hanzi)}`}>{r.hanzi} - {r.pinyin} - {r.english}</ViewTransitionLink>
        </li>
      ))}
    </ul>
  );
}
