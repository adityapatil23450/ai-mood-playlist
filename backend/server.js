import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Load environment variables
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// Initialize Gemini
const genAI = process.env.GOOGLE_API_KEY
  ? new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)
  : null

// Fallback playlists in case AI fails
const fallbackPlaylists = {
  happy:[
    {title:"Happy – Pharrell Williams",link:"https://www.youtube.com/watch?v=ZbZSe6N_BXs"},
    {title:"Best Day Of My Life – American Authors",link:"https://www.youtube.com/watch?v=Y66j_BUCBMY"},
    {title:"Can’t Stop The Feeling! – Justin Timberlake",link:"https://www.youtube.com/watch?v=ru0K8uYEZWw"}
  ],
  sad:[
    {title:"Someone Like You – Adele",link:"https://www.youtube.com/watch?v=hLQl3WQQoQ0"},
    {title:"Fix You – Coldplay",link:"https://www.youtube.com/watch?v=k4V3Mo61fJM"},
    {title:"Let Her Go – Passenger",link:"https://www.youtube.com/watch?v=RBumgq5yVrA"}
  ],
  chill:[
    {title:"Lofi Hip Hop Beats",link:"https://www.youtube.com/watch?v=jfKfPfyJRdk"},
    {title:"Weightless – Marconi Union",link:"https://www.youtube.com/watch?v=UfcAVejslrU"},
    {title:"Chillhop Essentials",link:"https://www.youtube.com/watch?v=Dx5qFachd3A"}
  ],
  workout:[
    {title:"Eye of the Tiger – Survivor",link:"https://www.youtube.com/watch?v=btPJPFnesV4"},
    {title:"Stronger – Kanye West",link:"https://www.youtube.com/watch?v=PsO6ZnUZI0g"},
    {title:"Till I Collapse – Eminem",link:"https://www.youtube.com/watch?v=ytQ5CYE1VZw"}
  ],
  romantic:[
    {title:"Perfect – Ed Sheeran",link:"https://www.youtube.com/watch?v=2Vv-BfVoq4g"},
    {title:"All of Me – John Legend",link:"https://www.youtube.com/watch?v=450p7goxZqg"},
    {title:"Thinking Out Loud – Ed Sheeran",link:"https://www.youtube.com/watch?v=lp-EO5I60KA"}
  ],
  party:[
    {title:"Uptown Funk – Mark Ronson ft. Bruno Mars",link:"https://www.youtube.com/watch?v=OPf0YbXqDm0"},
    {title:"Despacito – Luis Fonsi ft. Daddy Yankee",link:"https://www.youtube.com/watch?v=kJQP7kiw5Fk"},
    {title:"Don’t Stop the Music – Rihanna",link:"https://www.youtube.com/watch?v=yd8jh9QYfEs"}
  ],
  focus:[
    {title:"Beethoven – Moonlight Sonata",link:"https://www.youtube.com/watch?v=4Tr0otuiQuU"},
    {title:"Bach – Cello Suite No.1",link:"https://www.youtube.com/watch?v=mGQLXRTl3Z0"},
    {title:"Mozart – Piano Concerto No.21",link:"https://www.youtube.com/watch?v=df-eLzao63I"}
  ]
}
// Function to generate YouTube search URL
function generateYouTubeLink(songTitle, artist) {
  const searchQuery = encodeURIComponent(`${songTitle} ${artist}`)
  return `https://www.youtube.com/results?search_query=${searchQuery}`
}

// Function to generate AI-powered playlist via Gemini
async function generateAIPlaylist(mood) {
  try {
    if (!genAI) return null

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    const prompt = `Generate a playlist of 8-10 songs that perfectly match the mood: "${mood}".
For each song, provide the title and artist in the format "Title – Artist".
Focus on popular, well-known songs that are easily found on music platforms.
Return only the song list, one song per line, no additional text or numbering.`

    const result = await model.generateContent(prompt)
    const response = result.response.text().trim()
    const songLines = response.split('\n').filter(line => line.trim() && line.includes('–'))
    
    const songs = songLines.map(line => {
      const parts = line.trim().split('–')
      if (parts.length >= 2) {
        const title = parts[0].trim()
        const artist = parts[1].trim()
        return {
          title: `${title} – ${artist}`,
          link: generateYouTubeLink(title, artist)
        }
      }
      return {
        title: line.trim(),
        link: generateYouTubeLink(line.trim(), "")
      }
    })

    return songs.length > 0 ? songs : null
  } catch (error) {
    console.error('Gemini API Error:', error)
    return null
  }
}

// Main playlist endpoint
app.get("/playlist-ai", async (req, res) => {
  try {
    const mood = (req.query.prompt || "").trim()
    
    if (!mood) {
      return res.status(400).json({ 
        error: "Please provide a mood", 
        mood: "", 
        songs: [] 
      })
    }

    console.log(`Generating playlist for mood: "${mood}"`)

    // Try to generate AI playlist first
    let songs = null
    if (process.env.GOOGLE_API_KEY && process.env.GOOGLE_API_KEY !== 'your_gemini_api_key_here') {
      songs = await generateAIPlaylist(mood)
    }

    // Fallback to predefined playlists if AI fails or no API key
    if (!songs) {
      console.log('Using fallback playlist')
      const moodLower = mood.toLowerCase()
      songs = fallbackPlaylists[moodLower] || fallbackPlaylists.chill
    }

    res.json({
      mood: mood,
      songs: songs,
      aiGenerated: !!songs && process.env.GOOGLE_API_KEY !== 'your_gemini_api_key_here'
    })

  } catch (error) {
    console.error('Server Error:', error)
    res.status(500).json({ 
      error: "Failed to generate playlist", 
      mood: req.query.prompt || "", 
      songs: fallbackPlaylists.chill 
    })
  }
})

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    aiEnabled: !!(process.env.GOOGLE_API_KEY && process.env.GOOGLE_API_KEY !== 'your_gemini_api_key_here')
  })
})
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`)
  console.log(`AI Mode: ${process.env.GOOGLE_API_KEY && process.env.GOOGLE_API_KEY !== 'your_gemini_api_key_here' ? 'Enabled (Gemini)' : 'Disabled (using fallback playlists)'}`)
})