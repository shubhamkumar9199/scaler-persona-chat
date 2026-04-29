# Scaler Persona Chat

A chatbot where you can talk to three Scaler / InterviewBit personalities — **Anshuman Singh**, **Abhimanyu Saxena**, and **Kshitij Mishra**. Each one has their own system prompt so the answers actually feel like them, not a generic LLM.

Built for the Prompt Engineering assignment at Scaler Academy.

## What it does

- Switch between three personas with one click
- Conversation resets when you switch (so personas don't bleed into each other)
- Quick-start suggestion chips per persona
- Typing indicator while waiting for the API
- Friendly error message if the backend / API is down (instead of a blank screen)
- Mobile + desktop layouts

## Tech

- **Frontend**: React (Create React App), plain CSS
- **Backend**: Node.js + Express
- **LLM**: Groq (`llama-3.3-70b-versatile`) — OpenAI-compatible API, fast and cheap

## Project structure

```
chat-persona/
├── backend/
│   ├── server.js          # express server, /chat endpoint, system prompts
│   ├── .env.example       # copy to .env and add your key
│   └── package.json
├── frontend/
│   └── src/
│       ├── App.js         # chat UI
│       └── App.css        # scaler-themed styles
├── prompts.md             # all 3 system prompts + why they work
├── reflection.md          # 300–500 word writeup
└── README.md
```

## Setup

You'll need Node 18+ installed.

### 1. Clone and install

```bash
git clone https://github.com/<your-username>/scaler-persona-chat.git
cd scaler-persona-chat

cd backend && npm install
cd ../frontend && npm install
```

### 2. Backend env

Get a Groq API key from https://console.groq.com/keys (free tier works fine).

```bash
cd backend
cp .env.example .env
# open .env and paste your key into GROQ_API_KEY
```

`.env` looks like this:

```
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx
PORT=5000
```

### 3. Run

Two terminals:

```bash
# terminal 1
cd backend
npm start
# → Server running on port 5000

# terminal 2
cd frontend
npm start
# → opens http://localhost:3000
```

If you deployed the backend somewhere else, point the frontend at it by setting `REACT_APP_API_URL` in `frontend/.env`:

```
REACT_APP_API_URL=https://your-backend.onrender.com/chat
```

## Prompt engineering

All three system prompts live in `backend/server.js` (and are documented in [prompts.md](./prompts.md)). Each one includes:

- A persona description (background, tone, what they care about)
- 3 few-shot examples of user question → ideal answer
- A chain-of-thought instruction (think step-by-step before answering)
- Output format rules (4–5 sentences, end with a question)
- Constraints (what the persona should never do — no fluff, no negativity, etc.)

The detailed reasoning behind each prompt is in `prompts.md`.

## Deploying

- **Backend**: Render works well for free Node hosting. Set `GROQ_API_KEY` in the dashboard env vars (don't commit it).
- **Frontend**: Vercel or Netlify. Set `REACT_APP_API_URL` to your deployed backend URL.

## Notes

- API key is **never** in source — it's loaded from `.env`, which is gitignored.
- If the Groq call fails, the backend falls back to a generic persona-flavored response so the UI never breaks.
- Switching persona clears the message list — this is intentional, otherwise the new persona would see the previous persona's chat as context.

## License

MIT — do whatever you want with it.
