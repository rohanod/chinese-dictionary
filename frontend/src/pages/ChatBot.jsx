import { useChat } from 'ai/react';

export default function ChatBot() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({ api: '/api/chat' });

  return (
    <div>
      <h2>AI Chatbot</h2>
      <div style={{ height: '300px', overflowY: 'auto', border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
        {messages.map((m, i) => (
          <div key={i}><strong>{m.role}:</strong> {m.content}</div>
        ))}
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
        <input value={input} onChange={handleInputChange} style={{ flex: 1 }} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
