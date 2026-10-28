import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { LocaleProvider } from './lib/i18n.jsx';
import { SiteProvider } from './lib/site.jsx';
import { LibraryProvider } from './lib/store.jsx';

import './styles/tokens.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/pages.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LocaleProvider>
        <SiteProvider>
          <LibraryProvider>
            <App />
          </LibraryProvider>
        </SiteProvider>
      </LocaleProvider>
    </BrowserRouter>
  </StrictMode>,
);
