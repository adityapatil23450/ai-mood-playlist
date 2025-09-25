const express=require("express")
const cors=require("cors")
require("dotenv").config()
const{ GoogleGenerativeAI }=require("@google/generative-ai")
const app=express()
const PORT=5000
app.use(cors())
const samplePlaylists={
  happy:[
    {
      title:"Happy Vibes",
      artist:"The Joys",
      albumArt:"https://picsum.photos/100?random=1",
      link:"https://open.spotify.com/playlist/37i9dQZF1DXdPec7aLTmlC"
    },
    {
      title:"Good Energy",
      artist:"Sara T",
      albumArt:"https://picsum.photos/100?random=2",
      link:"https://music.youtube.com/playlist?list=PLFgquLnL59alCl_2TQvOiD5Vgm1hCaGSI"
    }
  ],
  sad: [
    {
      title:"Lonely Roads",
      artist:"Evan",
      albumArt:"https://picsum.photos/100?random=3",
      link:"https://open.spotify.com/playlist/37i9dQZF1DX7qK8ma5wgG1"
    },
    {
      title:"Grey Skies",
      artist:"Mila",
      albumArt:"https://picsum.photos/100?random=4",
      link:"https://music.youtube.com/playlist?list=PL4QNnZJr8cfYxpiSj-p7ap9J0YlY7zsrN"
    }
  ],
  workout:[
    {
      title:"Pump It Up",
      artist:"DJ Max",
      albumArt:"https://picsum.photos/100?random=5",
      link:"https://open.spotify.com/playlist/37i9dQZF1DX76Wlfdnj7AP"
    },
    {
      title:"Beast Mode",
      artist:"Rocky",
      albumArt:"https://picsum.photos/100?random=6",
      link:"https://music.youtube.com/playlist?list=PL9tY0BWXOZFsgb1p0h8GM7bptmJW5xFDs"
    }
  ],
  chill: [
    {
      title:"LoFi Beats",
      artist:"Beat Lab",
      albumArt:"https://picsum.photos/100?random=7",
      link:"https://open.spotify.com/playlist/37i9dQZF1DX889U0CL85jj"
    },
    {
      title:"Evening Breeze",
      artist:"Nora",
      albumArt:"https://picsum.photos/100?random=8",
      link:"https://music.youtube.com/playlist?list=PLFgquLnL59amUWHgW4h5qVymFtzrbZ2N0"
    }
  ]
}
function guessMood(text){
  const lower=text.toLowerCase()
  if (lower.includes("workout") || lower.includes("gym")) return "workout"
  if (lower.includes("sad") || lower.includes("cry")) return "sad"
  if (lower.includes("chill") || lower.includes("relax")) return "chill"
  if (lower.includes("happy") || lower.includes("joy")) return "happy"
  return "chill"
}
app.get("/playlist-ai", async (req,res) => {
  const text=req.query.prompt
  if (!text) return res.status(400).json({ error: "missing prompt" })
  try {
    let moodGuess
    if (!process.env.GEMINI_API_KEY) {
      moodGuess = guessMood(text)
    } else {
      const ai=new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
      const model=ai.getGenerativeModel({ model: "gemini-1.5-flash" })
      const result=await model.generateContent(
        `Classify this user mood: "${text}". Choose one word only like: happy, sad, workout, chill.`
      )
      moodGuess=result.response.text().trim().toLowerCase()
    }
    const playlist=samplePlaylists[moodGuess] || samplePlaylists["chill"]
    res.json({
      mood: moodGuess,
      prompt: text,
      songs: playlist
    })
  } catch (err) {
    console.error("AI error:", err.message)
    res.status(500).json({ error: "AI failed" })
  }
})
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`)
})
