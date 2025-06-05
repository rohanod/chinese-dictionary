import { useChat } from 'ai/react';

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({ api: '/api/chat' });

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Chatbot</h2>
      <div className="space-y-2 mb-4">
        {messages.map((m, i) => (
          <div key={i} className="p-2 border rounded">
            <strong>{m.role}:</strong> {m.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          className="flex-1 border rounded p-2"
          value={input}
          onChange={handleInputChange}
          placeholder="Say something"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Send
        </button>
      </form>
    </div>
  );
}
