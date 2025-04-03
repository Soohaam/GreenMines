
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Preload sound effects
const preloadSounds = () => {
  const sounds = [
    '/explosion_sound.mp3',
    '/planting_sound.mp3'
  ];
  
  sounds.forEach(soundPath => {
    const audio = new Audio();
    audio.src = soundPath;
    audio.preload = 'auto';
  });
};

// Try to preload sounds (will silently fail if files don't exist)
try {
  preloadSounds();
} catch (e) {
  console.warn("Could not preload sound files:", e);
}

createRoot(document.getElementById("root")!).render(<App />);
