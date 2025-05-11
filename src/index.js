import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';
import './styles/index.css';
import clerkAppearance from './utils/clerkAppearance';
import { FinanceProvider } from './contexts/FinanceContext';

// Using a temporary mock key for development
const clerkPubKey = 'pk_test_DEMO_KEY_FOR_DEVELOPMENT_ONLY';

// Mock ClerkProvider for development
const MockClerkProvider = ({ children }) => {
  console.log('Using Mock Clerk Provider for development');
  return children;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Using MockClerkProvider instead of ClerkProvider for development */}
    <MockClerkProvider>
      <BrowserRouter>
        <FinanceProvider>
          <App />
        </FinanceProvider>
      </BrowserRouter>
    </MockClerkProvider>
  </React.StrictMode>
);

