import { useEffect, useState } from 'react';
import { HomePage } from './pages/HomePage';
import { AssistantPage } from './pages/AssistantPage';

const currentHash = () => window.location.hash;

export function App() {
  const [hash, setHash] = useState(currentHash);

  useEffect(() => {
    const update = () => setHash(currentHash());
    window.addEventListener('hashchange', update);
    window.addEventListener('popstate', update);
    return () => {
      window.removeEventListener('hashchange', update);
      window.removeEventListener('popstate', update);
    };
  }, []);

  if (hash.startsWith('#/assistant')) return <AssistantPage />;
  return <HomePage />;
}
