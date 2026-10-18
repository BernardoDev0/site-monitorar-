import { Header } from './Header';
import { Footer } from './Footer';
import Home from './Home';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { EditorialNavigation } from '@/editorial/NavigationContext';
import { useRef } from 'react';
import { usePageMotion } from './usePageMotion';

export default function App() {
  const root = useRef<HTMLDivElement>(null);
  usePageMotion(root);
  return <EditorialNavigation.Provider value={true}>
    <div ref={root} className="erm-preview">
    <a className="skip-link" href="#conteudo">Pular para conteúdo</a>
    <Header />
    <main id="conteudo"><Home /></main>
    <Footer />
    <WhatsAppButton />
    </div>
  </EditorialNavigation.Provider>;
}
