import express from 'express';
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;
  const result = streamText({
    model: google('gemini-2.0-flash-exp', {
      apiKey: process.env.VITE_GEMINI_API_KEY
    }),
    messages
  });

  result.pipeTextStreamToResponse(res);
});

const port = process.env.PORT || 5173;
app.use(express.static('dist'));
app.listen(port, () => console.log(`server on ${port}`));
