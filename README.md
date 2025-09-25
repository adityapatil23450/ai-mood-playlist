# Mood Playlist Generator

Simple full-stack app that generates a music playlist based on your mood. Built with React (frontend) and Express (backend).

It supports two modes:
- AI mode (Gemini) for any custom mood you type
- Fallback mode (small predefined lists) if AI key is missing

## Features

- Select a preset mood (happy, sad, chill, workout, romantic, party, focus)
- Or type any custom mood (e.g. "rainy cafe", "late night drive")
- Small badge shows if the list came from AI or fallback
- Clean, minimal UI (Tailwind)

## Project Structure

```
mood-playlist/
├─ backend/
│  ├─ server.js          # Express backend (Gemini + fallback)
│  ├─ package.json
│  └─ .env               # GOOGLE_API_KEY lives here (not committed)
└─ frontend/
   ├─ src/
   │  ├─ App.js
   │  ├─ index.js
   │  └─ index.css
   ├─ public/
   │  └─ index.html
   └─ package.json
```

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm

### 1) Backend

```sh
cd backend
npm install
# create .env and add your Gemini key:
# GOOGLE_API_KEY=sk-...your_key...
npm start
```
Backend runs at http://localhost:5000.

If you skip the key, it will still work using fallback playlists.

### 2) Frontend

```sh
cd frontend
npm install
npm start
```
Frontend runs at http://localhost:3000.

The dev proxy in `frontend/package.json` points to the backend, so `fetch('/playlist-ai')` just works in dev.

## Usage

1. Open the frontend.
2. Click a mood button or type your own mood and press Generate.
3. Check the small badge: "AI" (Gemini) or "fallback".
4. Click a song to open a YouTube search for it.

## Customization

- Tweak the Gemini prompt in `backend/server.js` (function `generateAIPlaylist`).
- Edit fallback lists in `backend/server.js` (`fallbackPlaylists`).
- UI styles live in `frontend/src/App.js` and `index.css`.

## Troubleshooting

- If AI fails, the app falls back automatically and logs an error on the server.
- Make sure `GOOGLE_API_KEY` is set in `backend/.env` and restart the backend after changing it.
- If ports clash, set `PORT=5001` in `backend/.env` and update the frontend proxy.

## Small personal note

I kept the code simple on purpose so it’s easy to read and change. The AI part is optional – the app runs even without a key using small fallback playlists.

## License

MIT
