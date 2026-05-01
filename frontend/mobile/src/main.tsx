import React from 'react';
import { createRoot } from 'react-dom/client';
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import './theme/variables.css';
import './theme/global.css';
import { App } from './App';

const container = document.getElementById('root');

if (!container) {throw new Error('Missing root element');}

createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
