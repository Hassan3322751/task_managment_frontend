// src/index.js (or main.jsx)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './auth/AuthContext'; // Import your provider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider> {/* Wrap the App here */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);