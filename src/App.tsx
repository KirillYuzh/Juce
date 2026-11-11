import { HomePage } from './pages/HomePage';
import { ResearchersPage } from './pages/ResearchersPage';
import { AssistantPage } from './pages/AssistantPage';

export function App() {
  const { hash } = window.location;
  if (hash.startsWith('#/researchers')) return <ResearchersPage />;
  if (hash.startsWith('#/assistant')) return <AssistantPage />;
  return <HomePage />;
}
