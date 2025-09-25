import React, { useState } from "react"
function App() {
  const [prompt, setPrompt]=useState("")
  const [playlist, setPlaylist]=useState(null)
  const [loading, setLoading]=useState(false)
  const getAiPlaylist=() => {
    if (!prompt.trim()) return
    setLoading(true)
    setPlaylist(null)
    fetch(`http://localhost:5000/playlist-ai?prompt=${encodeURIComponent(prompt)}`)
      .then(res => res.json())
      .then(data => {
        setPlaylist(data)
        setLoading(false)
      })
      .catch(err => {
        console.error("ai fetch error", err)
        setLoading(false)
      })
  }
  return (
    <div style={{ fontFamily: "Arial", padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <h1>🎶 AI Mood Playlist</h1>
      <p>Type how you feel and get songs that match your vibe.</p>
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. I feel like partying tonight"
          style={{ width: "70%", padding: 10, borderRadius: 5 }}
        />
        <button
          onClick={getAiPlaylist}
          style={{ marginLeft: 10, padding: "10px 15px", borderRadius: 5, cursor: "pointer" }}
        >
          Get Playlist
        </button>
      </div>
      {loading && <p>Loading playlist...</p>}
      {playlist && (
        <div style={{ marginTop: 30 }}>
          <h2>Playlist for mood: <span style={{ color: "blue" }}>{playlist.mood}</span></h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {playlist.songs.map((song, idx) => (
              <li key={idx} style={{ display: "flex", alignItems: "center", marginBottom: 15 }}>
                <img src={song.albumArt} alt="cover" style={{ width: 60, height: 60, marginRight: 15 }} />
                <div style={{ textAlign: "left" }}>
                  <div><b>{song.title}</b> – {song.artist}</div>
                  <a href={song.link} target="_blank" rel="noreferrer">▶ Open in Player</a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {!loading && !playlist && <p>No playlist yet. Try typing your mood above!</p>}
    </div>
  )
}
export default App
