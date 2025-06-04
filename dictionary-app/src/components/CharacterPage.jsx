import { useEffect, useState } from 'react';
import HanziWriter from 'hanzi-writer';
import { useParams } from 'react-router-dom';

export default function CharacterPage() {
  const { hanzi } = useParams();
  const [info, setInfo] = useState(null);

  useEffect(() => {
    fetch(`/api/entry/${encodeURIComponent(hanzi)}`)
      .then(res => res.json())
      .then(setInfo)
      .catch(() => setInfo(null));
  }, [hanzi]);

  useEffect(() => {
    if (!info) return;
    const writer = HanziWriter.create('writer', hanzi, {
      width: 200,
      height: 200,
      showOutline: true,
      showCharacter: true,
    });
    writer.animateCharacter();
  }, [info, hanzi]);

  if (!info) return <div>Loading...</div>;

  const entry = info.entries[0];

  return (
    <div>
      <h2>{hanzi}</h2>
      <div id="writer" />
      {entry && (
        <>
          <p>Pinyin: {entry.pinyin}</p>
          <p>English: {entry.english.join('; ')}</p>
        </>
      )}
      {info.frequency && <p>Frequency rank: {info.frequency.number}</p>}
      <h3>Radicals</h3>
      <ul>
        {info.radicals.map(r => (
          <li key={r}>
            <a href={`/character/${encodeURIComponent(r)}`}>{r}</a>
          </li>
        ))}
      </ul>
      <h3>Examples</h3>
      <ul>
        {info.examples.map((ex, idx) => (
          <li key={idx}>{ex.simplified} - {ex.definition}</li>
        ))}
      </ul>
    </div>
  );
}
