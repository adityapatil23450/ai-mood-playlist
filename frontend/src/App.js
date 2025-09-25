import React, { useState } from "react";
export default function App() {
  const [mood, setMood] = useState("");
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const moods = ["happy", "sad", "chill", "workout", "romantic", "party", "focus"];
  async function fetchPlaylist(selectedMood) {
    try {
      setError("");
      setSongs([]);
      setLoading(true);
      const res = await fetch(`/playlist-ai?prompt=${selectedMood}`);
      if (!res.ok) throw new Error("Failed to fetch playlist");
      const data = await res.json();
      setSongs(data.songs);
      setMood(selectedMood);
    } catch (err) {
      setError("Could not fetch playlist");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center p-6 text-white">
      <h1 className="text-4xl font-bold mb-6">🎶 Mood Playlist Generator</h1>
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {moods.map(m => (
          <button
            key={m}
            onClick={() => fetchPlaylist(m)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              mood === m ? "bg-white text-indigo-600" : "bg-indigo-700 hover:bg-indigo-600"
            }`}
          >
            {m}
          </button>
        ))}
      </div>
      {loading && <p className="text-lg">Loading...</p>}
      {error && <p className="text-red-200">{error}</p>}
      <div className="grid gap-4 max-w-lg w-full">
        {songs.map((song, idx) => (
          <a
            key={idx}
            href={song.link}
            target="_blank"
            rel="noreferrer"
            className="block p-4 bg-white text-indigo-700 rounded-lg shadow hover:shadow-lg transition"
          >
            {song.title}
          </a>
        ))}
      </div>
    </div>
  );
}