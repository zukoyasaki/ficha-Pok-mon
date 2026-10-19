import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { SpriteFormatProvider } from './context/SpriteFormatContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <SpriteFormatProvider>
    <App />
  </SpriteFormatProvider>
);
