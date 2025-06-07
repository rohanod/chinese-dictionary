import express from 'express';
import { createServer as createViteServer } from 'vite';

const isProd = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 5173;

async function startServer() {
  const app = express();

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.use(express.json());

  app.post('/api/chat', (req, res) => {
    // Placeholder AI response
    const userMessage = req.body?.messages?.at(-1)?.content || '';
    res.json({
      messages: [
        { role: 'assistant', content: `You said: ${userMessage}` }
      ]
    });
  });

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

startServer();
