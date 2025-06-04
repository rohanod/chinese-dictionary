import { useChat } from '@ai-sdk/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat'
  });

  return (
    <div>
      <h1>AI Chatbot</h1>
      <div style={{height:'300px',overflowY:'auto',border:'1px solid #ccc',padding:'8px'}}>
        {messages.map(m => (
          <div key={m.id}><strong>{m.role}:</strong> {m.content}</div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
