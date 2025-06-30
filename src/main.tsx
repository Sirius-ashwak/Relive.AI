import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { QueryProvider } from './providers/QueryProvider.tsx';
import './index.css';

// Error boundary for better error handling
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-obsidian-950 flex items-center justify-center p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Something went wrong</h1>
            <p className="text-obsidian-300 mb-6">
              We're sorry, but something unexpected happened. Please refresh the page to try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-aurora-500 text-white rounded-xl font-semibold hover:bg-aurora-600 transition-colors"
            >
              Refresh Page
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-coral-400 cursor-pointer">Error Details</summary>
                <pre className="mt-2 p-4 bg-obsidian-800 rounded-lg text-xs text-obsidian-200 overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Register service worker for PWA
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Initialize app with error handling
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

try {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <QueryProvider>
          <App />
        </QueryProvider>
      </ErrorBoundary>
    </StrictMode>
  );
} catch (error) {
  console.error('Failed to render app:', error);
  // Fallback rendering
  rootElement.innerHTML = `
    <div style="min-height: 100vh; background: #050507; display: flex; align-items: center; justify-content: center; padding: 24px; font-family: system-ui;">
      <div style="text-align: center; color: white;">
        <h1 style="font-size: 24px; margin-bottom: 16px;">Loading Error</h1>
        <p style="color: #9CA3AF; margin-bottom: 24px;">Failed to load the application. Please refresh the page.</p>
        <button onclick="window.location.reload()" style="padding: 12px 24px; background: #0EA5E9; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
          Refresh Page
        </button>
      </div>
    </div>
  `;
}