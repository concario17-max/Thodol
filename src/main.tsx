import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { UIProvider } from './context/UIContext.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider>
            <UIProvider>
                <App />
            </UIProvider>
        </ThemeProvider>
    </StrictMode>,
);
