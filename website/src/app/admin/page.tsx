"use client";
import { useState } from 'react';

export default function AdminDashboard() {
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [data, setData] = useState<{users: Record<string, string>, leaderboard: any[]}>({ users: {}, leaderboard: [] });
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
        setLoggedIn(true);
      } else {
        setError('ACCESS DENIED');
      }
    } catch (e) {
      setError('NETWORK ERROR');
    }
  };

  if (!loggedIn) {
    return (
      <>
        <div className="scanline" />
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <h1 className="title-glitch" style={{ color: 'var(--cp-red)' }}>SYSADMIN_ACCESS</h1>
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="ENTER OVERRIDE CODE"
              style={{ padding: '10px', background: 'transparent', border: '1px solid var(--cp-red)', color: 'var(--cp-red)', outline: 'none' }}
            />
            <button 
              onClick={handleLogin}
              style={{ padding: '10px 20px', background: 'var(--cp-red)', color: 'black', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
            >
              EXECUTE
            </button>
          </div>
          {error && <div style={{ color: 'var(--cp-red)', marginTop: '20px', letterSpacing: '2px' }}>[ {error} ]</div>}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="scanline" />
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <h1 className="title-glitch" style={{ color: 'var(--cp-yellow)', fontSize: '2rem', textAlign: 'center' }}>DATABANK_OVERVIEW</h1>
        
        <h2 style={{ color: 'var(--cp-cyan)', borderBottom: '1px solid var(--cp-cyan)', paddingBottom: '10px', marginTop: '40px' }}>OPERATIVE CREDENTIALS</h2>
        <div className="board-wrapper" style={{ marginTop: '20px' }}>
          <div className="table-header" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div>USERNAME</div>
            <div>PASSWORD</div>
          </div>
          {Object.entries(data.users).map(([user, pass]) => (
            <div className="table-row" key={user} style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div style={{ color: 'var(--cp-yellow)' }}>{user}</div>
              <div style={{ color: 'var(--cp-dim)' }}>{pass as string}</div>
            </div>
          ))}
        </div>

        <h2 style={{ color: 'var(--cp-cyan)', borderBottom: '1px solid var(--cp-cyan)', paddingBottom: '10px', marginTop: '40px' }}>ALL NETWORK ACTIVITY</h2>
        <div className="board-wrapper" style={{ marginTop: '20px' }}>
          <div className="table-header" style={{ gridTemplateColumns: '1fr 1fr 2fr' }}>
            <div>OPERATIVE</div>
            <div>SCORE</div>
            <div>TIMESTAMP</div>
          </div>
          {data.leaderboard.map((entry, idx) => (
            <div className="table-row" key={idx} style={{ gridTemplateColumns: '1fr 1fr 2fr' }}>
              <div style={{ color: 'var(--cp-yellow)' }}>{entry.username}</div>
              <div className="score-text">{entry.score}</div>
              <div style={{ color: 'var(--cp-dim)', fontSize: '0.8rem' }}>{new Date(entry.date).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
