import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';
import './styles/index.css';
import clerkAppearance from './utils/clerkAppearance';
import { FinanceProvider } from './contexts/FinanceContext';

// Get the Clerk publishable key from environment variables
const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

// Check if the key is available
if (!clerkPubKey) {
  throw new Error('Missing Clerk Publishable Key');
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={clerkPubKey}
      appearance={clerkAppearance}
      navigate={(to) => window.location.href = to}
      redirectUrl={window.location.origin}
    >
      <BrowserRouter>
        <FinanceProvider>
          <App />
        </FinanceProvider>
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>
);
