import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './utils/seedDatabase'

createRoot(document.getElementById("root")!).render(<App />);
