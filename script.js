// ================== Mood Playlists ==================
const moodPlaylists = {
  happy: "37i9dQZF1DXdPec7aLTmlC",
  sad: "37i9dQZF1DX7qK8ma5wgG1",
  party: "37i9dQZF1DXaXB8fQg7xif",
  chill: "37i9dQZF1DX4WYpdgoIcn6",
  romantic: "37i9dQZF1DX50QitC6Oqtn",
  motivational: "37i9dQZF1DX70RN3TfWWJh",
  lofi: "37i9dQZF1DX3rxVfibe1L0",
  rock: "37i9dQZF1DWXRqgorJj26U",
  jazz: "37i9dQZF1DXbITWG1ZJKYt"
};

// ================== Mood Quotes ==================
const moodQuotes = {
  happy: "Smile, it's a good day to feel good! 😊",
  sad: "Every storm runs out of rain... 😭",
  party: "Let's turn up the energy and dance! 🎉",
  chill: "Relax and breathe... 😌",
  romantic: "Love is in the air ❤️",
  motivational: "Push yourself, because no one else will! 🔥",
  lofi: "Focus beats in the background... 🤯",
  rock: "Feel the power of rock! 🤘",
  jazz: "Smooth vibes for smooth minds 🎷"
};

// ================== Mood Slider ==================
const surveyMoods = ["happy","sad","party","chill","romantic","motivational","lofi","rock","jazz"];
const surveyDisplay = document.getElementById("surveySuggestion");
const moodRange = document.getElementById("moodRange");

moodRange.addEventListener("input", ()=> {
  const index = Math.round(moodRange.value - 1);
  surveyDisplay.textContent = `Mood suggestion: ${surveyMoods[index]} ${getEmoji(surveyMoods[index])}`;
});

function getEmoji(mood) {
  return {
    happy:"😊", sad:"😭", party:"😎", chill:"😌",
    romantic:"❤️", motivational:"🔥", lofi:"🤯", rock:"🤘", jazz:"🎷"
  }[mood] || "";
}

// ================== Mood Colors ==================
const moodColors = {
  happy: ["#2b2b2b","#ffb347","#ffcc33"],
  sad: ["#0d1117","#161b22","#1b1f28"],
  party: ["#1b1b2f","#ff6ec7","#6eebff"],
  chill: ["#1a1a2e","#66a6ff","#89f7fe"],
  romantic: ["#2b1a1e","#ff6f91","#ffb3c1"],
  motivational: ["#1a2b1a","#43e97b","#38f9d7"],
  lofi: ["#1a1a1a","#a1c4fd","#c2e9fb"],
  rock: ["#232526","#414345","#555555"],
  jazz: ["#1c1c2e","#2a2a3f","#6a82fb"]
};

// ================== DOM Elements ==================
const moodButtons = document.getElementById("moodButtons");
const quoteDisplay = document.getElementById("quoteDisplay");
const spotifyEmbed = document.getElementById("spotifyEmbed");
const bg = document.getElementById("background");
const canvas = document.getElementById("effectCanvas");
const ctx = canvas.getContext("2d");

let particles = [];
let animationId;
let moodMarkDiv = null;

// ================== Resize Canvas ==================
function resizeCanvas(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// ================== Mood Button Click ==================
moodButtons.addEventListener("click", (e)=>{
  const btn = e.target.closest(".mood");
  if(!btn) return;
  const mood = btn.dataset.mood;

  // Highlight active
  moodButtons.querySelectorAll(".mood").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");

  // Update quote
  quoteDisplay.textContent = moodQuotes[mood];

  // Background gradient
  setBackgroundByMood(mood);

  // Spotify embed
  const playlistId = moodPlaylists[mood];
  if(playlistId){
    spotifyEmbed.innerHTML = `<iframe src="https://open.spotify.com/embed/playlist/${playlistId}" allow="encrypted-media; autoplay;" allowfullscreen></iframe>`;
  }

  // Generate blobs & effects
  generateBlobs(mood);
  startEffect(mood);

  // Show subtle mood watermark
  showMoodWatermark(mood);
});

// Background Gradient 
function setBackgroundByMood(mood){
  const colors = moodColors[mood] || ["#0d1117","#161b22","#1b1f28"];
  document.body.style.background = `linear-gradient(135deg, ${colors[0]}, ${colors[1]}, ${colors[2]})`;
}

//Blobs
function generateBlobs(mood){
  const colors = moodColors[mood] || ["#444","#555"];
  bg.innerHTML = '';
  for(let i=0;i<12;i++){
    const blob = document.createElement('div');
    blob.classList.add('blob');
    blob.style.width = `${80+Math.random()*180}px`;
    blob.style.height = blob.style.width;
    blob.style.background = colors[Math.floor(Math.random()*colors.length)];
    blob.style.top = `${Math.random()*100}%`;
    blob.style.left = `${Math.random()*100}%`;
    blob.style.opacity = 0.2 + Math.random()*0.3;
    blob.style.animationDuration = `${15+Math.random()*15}s`;
    bg.appendChild(blob);
  }
}

// Particle Effects
function startEffect(mood){
  particles=[];
  cancelAnimationFrame(animationId);

  switch(mood){
    case "party": initConfetti(moodColors[mood]); break;
    case "sad": initRain(); break;
    case "chill": case "lofi": initSparkles(moodColors[mood]); break;
    default: break;
  }

  animateParticles();
}

function clearEffects(){
  particles=[];
  cancelAnimationFrame(animationId);
  ctx.clearRect(0,0,canvas.width,canvas.height);
}

function initConfetti(colors){
  for(let i=0;i<100;i++){
    particles.push({
      x:Math.random()*canvas.width,
      y:Math.random()*canvas.height,
      r:Math.random()*5+3,
      dx:(Math.random()-0.5)*1.5,
      dy:Math.random()*3+0.5,
      color: colors[Math.floor(Math.random()*colors.length)]
    });
  }
}

function initRain(){
  for(let i=0;i<150;i++){
    particles.push({
      x:Math.random()*canvas.width,
      y:Math.random()*canvas.height,
      w:2,
      h:8+Math.random()*5,
      dy:2+Math.random()*2,
      color:"rgba(174,194,224,0.4)"
    });
  }
}

function initSparkles(colors){
  for(let i=0;i<80;i++){
    particles.push({
      x:Math.random()*canvas.width,
      y:Math.random()*canvas.height,
      r:Math.random()*1.5+0.5,
      dx:(Math.random()-0.5)*0.5,
      dy:(Math.random()-0.5)*0.5,
      color: colors[Math.floor(Math.random()*colors.length)]
    });
  }
}

function animateParticles(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach(p=>{
    if(p.r){
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=p.color;
      ctx.shadowColor=p.color;
      ctx.shadowBlur=6;
      ctx.fill();
      p.x+=p.dx; p.y+=p.dy;
      if(p.y>canvas.height)p.y=0;
      if(p.x>canvas.width)p.x=0;
      if(p.x<0)p.x=canvas.width;
    } else {
      ctx.fillStyle=p.color;
      ctx.fillRect(p.x,p.y,p.w,p.h);
      p.y+=p.dy;
      if(p.y>canvas.height)p.y=-p.h;
    }
  });
  animationId=requestAnimationFrame(animateParticles);
}

// ================== Mood Watermark SVGs ==================
function showMoodWatermark(mood){
  if(moodMarkDiv) moodMarkDiv.remove();
  moodMarkDiv = document.createElement("div");
  moodMarkDiv.classList.add("mood-mark");

  let svgIcon = "";
  let position = {top:"50%", left:"50%"};
  let animationClass = "float";

  switch(mood){
    case "happy":
      svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="#FFD93B" width="80" height="80">
        <circle cx="32" cy="32" r="30"/>
        <circle cx="22" cy="26" r="4" fill="#000"/>
        <circle cx="42" cy="26" r="4" fill="#000"/>
        <path d="M22 42c4 6 16 6 20 0" stroke="#000" stroke-width="3" fill="none"/>
      </svg>`; break;
    case "romantic":
      svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="#FF4C4C" width="80" height="80">
                <path d="M32 58s26-16 26-34c0-8-6-14-14-14-6 0-12 6-12 6s-6-6-12-6c-8 0-14 6-14 14 0 18 26 34 26 34z"/>
      </svg>`; break;
    case "sad":
      svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="#5DADE2" width="80" height="80">
        <circle cx="32" cy="32" r="30" fill="none" stroke="#5DADE2" stroke-width="4"/>
        <path d="M20 36c0 6 24 6 24 0" stroke="#000" stroke-width="3" fill="none"/>
      </svg>`; break;
    case "motivational":
      svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="#FF7F50" width="80" height="80">
        <path d="M32 2L26 24h12L32 2zm0 60V26" stroke="#FFF" stroke-width="3"/>
      </svg>`; break;
    case "party":
      svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="#DDA0DD" width="80" height="80">
        <path d="M32 2l6 20h-12l6-20zm0 60v-30" stroke="#FFF" stroke-width="3"/>
      </svg>`; animationClass = "rotate"; break;
    case "chill":
    case "lofi":
      svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="#85C1E9" width="80" height="80">
        <circle cx="32" cy="32" r="14"/>
      </svg>`; break;
    case "rock":
      svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="#A569BD" width="80" height="80">
        <polygon points="32,2 22,62 32,50 42,62 32,2"/>
      </svg>`; break;
    case "jazz":
      svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="#3498DB" width="80" height="80">
        <rect x="16" y="30" width="32" height="4"/>
        <circle cx="48" cy="32" r="4"/>
      </svg>`; break;
  }

  moodMarkDiv.innerHTML = svgIcon;
  moodMarkDiv.style.top = position.top;
  moodMarkDiv.style.left = position.left;
  moodMarkDiv.classList.add(animationClass);
  document.body.appendChild(moodMarkDiv);
}

// Initialize Default
window.addEventListener("load", ()=>{
  setBackgroundByMood("chill");
  generateBlobs("chill");
  surveyDisplay.textContent=`Mood suggestion: chill 😌`;
  showMoodWatermark("chill");
});

