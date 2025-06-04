'use client';
import { useChat } from 'ai/react';

export default function Chatbot() {
  const { messages, input, handleInputChange, handleSubmit, status } = useChat();

  return (
    <div>
      <div>
        {messages.map(m => (
          <div key={m.id}>{m.role === 'user' ? 'User: ' : 'AI: '}{m.content}</div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          name="prompt"
          value={input}
          onChange={handleInputChange}
          disabled={status !== 'idle'}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
