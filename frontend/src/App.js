import React, { useState } from "react";
export default function App() {
  // selected mood label (from button or custom input)
  const [mood, setMood] = useState("");
  // text field for user-typed mood
  const [customMood, setCustomMood] = useState("");
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // backend sends a flag so we can show if the list was AI-generated or a fallback
  const [aiGenerated, setAiGenerated] = useState(false);
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
      setAiGenerated(data.aiGenerated || false);
    } catch (err) {
      setError("Could not fetch playlist");
    } finally {
      setLoading(false);
    }
  }
  
  const handleCustomMoodSubmit = (e) => {
    e.preventDefault();
    if (customMood.trim()) {
      fetchPlaylist(customMood.trim());
      setCustomMood("");
    }
  };
  
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
      {/* simple custom mood input for any vibe the user types */}
      <form onSubmit={handleCustomMoodSubmit} className="w-full max-w-lg mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type any mood (e.g. rainy cafe, coding focus, late night drive)"
            value={customMood}
            onChange={(e) => setCustomMood(e.target.value)}
            className="flex-1 px-3 py-2 rounded text-indigo-900 outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg font-semibold bg-white text-indigo-700 hover:bg-indigo-100 transition"
          >
            Generate
          </button>
        </div>
      </form>

      {/* small status line to show which mood is active and if AI was used */}
      {mood && (
        <p className="mb-3 text-sm opacity-90">
          Showing playlist for <span className="font-semibold">"{mood}"</span>
          {" "}
          <span className={`ml-2 inline-block px-2 py-0.5 rounded text-xs ${aiGenerated ? "bg-green-200 text-green-900" : "bg-yellow-200 text-yellow-900"}`}>
            {aiGenerated ? "AI" : "fallback"}
          </span>
        </p>
      )}
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