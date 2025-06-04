/* eslint-env node */
/* global process */
import express from 'express';
import { google } from '@ai-sdk/google';
import { streamText, generateText } from 'ai';
import path from 'path';
import { fileURLToPath } from 'url';
import cedict from 'cedict-json';
import hanzi from 'hanzi';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
hanzi.start();
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

app.get('/api/search', (req, res) => {
  const q = (req.query.q || '').trim().toLowerCase();
  if (!q) return res.json([]);
  const norm = q.normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/[0-9]/g, '').replace(/\s+/g, '');
  const results = cedict.filter(e => {
    const english = e.english.join('; ').toLowerCase();
    const hanzi = e.simplified;
    const pinyin = e.pinyin.normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/[0-9]/g, '').replace(/\s+/g, '').toLowerCase();
    return hanzi.includes(q) || english.includes(q) || pinyin.includes(norm);
  }).slice(0, 20);
  res.json(results);
});

app.get('/api/entry/:hanzi', (req, res) => {
  const char = req.params.hanzi;
  const entries = cedict.filter(e => e.simplified === char || e.traditional === char);
  if (!entries.length) return res.status(404).json({ error: 'not found' });
  const decomp = hanzi.decompose(char, 2) || { components: [] };
  const examples = (hanzi.getExamples(char)[0] || []).slice(0, 10);
  const frequency = hanzi.getCharacterFrequency(char);
  res.json({ entries, radicals: decomp.components, examples, frequency });
});

app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(8080, () => {
  console.log('Server running on http://localhost:8080');
});
