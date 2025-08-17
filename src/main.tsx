import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { VideoPlayerProvider } from '@/contexts/VideoPlayerContext'

createRoot(document.getElementById("root")!).render(
  <VideoPlayerProvider>
    <App />
  </VideoPlayerProvider>
);
