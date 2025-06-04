import { useState } from 'react';

export default function Translate() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);

  const handleTranslate = async () => {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    const data = await res.json();
    setResult(data.text);
  };

  return (
    <div>
      <textarea value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleTranslate}>Translate</button>
      {result && <pre>{result}</pre>}
    </div>
  );
}
