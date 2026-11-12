import { HomePage } from './pages/HomePage';
import { AssistantPage } from './pages/AssistantPage';

export function App() {
  const { hash } = window.location;
  if (hash.startsWith('#/assistant')) return <AssistantPage />;
  return <HomePage />;
}
