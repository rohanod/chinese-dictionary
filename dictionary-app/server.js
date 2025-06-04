/* eslint-env node */
/* global process */
import express from 'express';
import { google } from '@ai-sdk/google';
import { streamText, generateText } from 'ai';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

const model = google('gemini-1.5-flash', {
  apiKey: process.env.VITE_GEMINI_API_KEY,
});

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;
  const result = streamText({ model, messages });
  result.pipeTextStreamToResponse(res);
});

app.post('/api/translate', async (req, res) => {
  const { text } = req.body;
  const result = await generateText({
    model,
    prompt: `Provide the Chinese and English translation with pinyin for: ${text}`,
  });
  res.json({ text: result.text });
});

app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(8080, () => {
  console.log('Server running on http://localhost:8080');
});
