import { Header } from './Header';
import { Footer } from './Footer';
import Home from './Home';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { EditorialNavigation } from '@/editorial/NavigationContext';

export default function App() {
  return <EditorialNavigation.Provider value={true}>
    <a className="skip-link" href="#conteudo">Pular para conteúdo</a>
    <Header />
    <main id="conteudo"><Home /></main>
    <Footer />
    <WhatsAppButton />
  </EditorialNavigation.Provider>;
}
