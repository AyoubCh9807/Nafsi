import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './mainview/App.tsx';
import "./mainview/index.css";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
