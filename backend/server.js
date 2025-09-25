import express from "express"
import cors from "cors"
const app = express()
app.use(cors())
app.use(express.json())
const playlists={
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
app.get("/playlist-ai",(req,res)=>{
  const mood=(req.query.prompt||"").toLowerCase()
  const playlist=playlists[mood]||playlists.chill
  res.json({mood:mood||"chill",songs:playlist})
})
app.listen(5000,()=>console.log("✅ Backend running at http://localhost:5000"))