import { useState, useEffect, useRef } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://scaler-persona-chat.onrender.com/chat';
const PERSONAS = ['anshuman', 'abhimanyu', 'kshitij'];
const SUGGESTIONS = [
  'How to learn coding?',
  'How to stay consistent?',
];

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [persona, setPersona] = useState('anshuman');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    setError('');
    setInput('');
    setMessages(prev => [...prev, { id: Date.now(), from: 'me', text }]);
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, persona }),
      });

      if (!res.ok) throw new Error(`server returned ${res.status}`);

      const data = await res.json();
      setMessages(prev => [...prev, { id: Date.now() + 1, from: 'bot', text: data.reply }]);
    } catch (err) {
      console.log('chat failed', err);
      setError('Could not reach the server. Try again.');
    } finally {
      setLoading(false);
    }
  }

  function switchPersona(p) {
    if (p === persona) return;
    setPersona(p);
    setMessages([]);
    setError('');
  }

  function handleKey(e) {
    if (e.key === 'Enter') sendMessage();
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">SCALER<span className="dot">.</span></div>
        <h3>Personas</h3>
        {PERSONAS.map(p => (
          <button
            key={p}
            onClick={() => switchPersona(p)}
            className={persona === p ? 'persona active' : 'persona'}
          >
            {p}
          </button>
        ))}
      </aside>

      <main className="chat">
        <header className="topbar">
          <span>Talking to <b>{persona}</b></span>
        </header>

        <div className="messages">
          {messages.length === 0 && (
            <p className="empty">Say hi to {persona} 👋</p>
          )}

          {messages.map(m => (
            <div key={m.id} className={`bubble ${m.from}`}>
              {m.text}
            </div>
          ))}

          {loading && <div className="bubble bot typing">typing...</div>}
          {error && <div className="error">{error}</div>}

          <div ref={endRef} />
        </div>

        <div className="suggest">
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => setInput(s)}>{s}</button>
          ))}
        </div>

        <div className="inputbar">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={`Message ${persona}...`}
            disabled={loading}
          />
          <button onClick={sendMessage} disabled={loading || !input.trim()}>
            Send
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
