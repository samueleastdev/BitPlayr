import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Make sure App is a .tsx file if it contains JSX

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
