import { createStreamableUI, streamText } from 'ai';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { messages } = req.body;

  const stream = createStreamableUI();
  stream.update({ role: 'assistant', content: 'This is a placeholder response.' });
  stream.done();

  res.setHeader('Content-Type', 'application/json');
  for await (const chunk of streamText(stream)) {
    res.write(chunk);
  }
  res.end();
}
