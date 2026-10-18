import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import '@/index.css';
import './erm.css';

hydrateRoot(document.getElementById('root')!, <BrowserRouter><App /></BrowserRouter>);
