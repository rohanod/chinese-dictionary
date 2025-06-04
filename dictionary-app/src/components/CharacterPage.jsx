import { useEffect } from 'react';
import HanziWriter from 'hanzi-writer';
import data from '../data/dictionary.json';
import { useParams } from 'react-router-dom';

export default function CharacterPage() {
  const { hanzi } = useParams();
  const entry = data.find(e => e.hanzi === hanzi);

  useEffect(() => {
    if (!entry) return;
    const writer = HanziWriter.create('writer', hanzi, {
      width: 200,
      height: 200,
      showOutline: true,
      showCharacter: true,
    });
    writer.animateCharacter();
  }, [entry, hanzi]);

  if (!entry) return <div>Not found</div>;

  return (
    <div>
      <h2>{entry.hanzi}</h2>
      <div id="writer" />
      <p>Pinyin: {entry.pinyin}</p>
      <p>English: {entry.english}</p>
      <p>Literal: {entry.literal}</p>
      <p>Frequency: {entry.frequency}</p>
      <h3>Radicals</h3>
      <ul>
        {entry.radicals.map(r => (
          <li key={r}>
            <a href={`/character/${encodeURIComponent(r)}`}>{r}</a>
          </li>
        ))}
      </ul>
      <h3>Examples</h3>
      <ul>
        {entry.examples.map((ex, idx) => (
          <li key={idx}>{ex}</li>
        ))}
      </ul>
    </div>
  );
}
