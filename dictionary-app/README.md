# Chinese Dictionary App

This is a small Mandarin dictionary built with **Vite** and **React**.
Dictionary data comes from the [`cedict-json`](https://npm.im/cedict-json) package
and is served from an Express API together with extra information from
[`hanzi`](https://npm.im/hanzi).
The app demonstrates search, translation using Gemini through the Vercel AI SDK
and a simple chatbot interface.

## Development

```bash
npm install
npm run dev
```

The production server can be started with:

```bash
npm run build
npm start
```

Make sure `VITE_GEMINI_API_KEY` is available in your environment for the AI features.
