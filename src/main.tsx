import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/main.scss';
import App from './App.tsx';

const root = document.getElementById('root');
if(root) {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

