import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { UIProvider } from './context/UIContext.tsx';
import { YogaDataProvider } from './context/YogaDataContext.tsx';
import { AudioProvider } from './context/AudioContext.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider>
            <UIProvider>
                <YogaDataProvider>
                    <AudioProvider>
                        <App />
                    </AudioProvider>
                </YogaDataProvider>
            </UIProvider>
        </ThemeProvider>
    </StrictMode>,
);
