import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import type { EditorialPage } from "./editorial/types";
import "./index.css";
import "./site.css";
import "./editorial/editorial.css";
import "./v4-base.css";
import "./v4.css";
import "./v4.1.css";
import { EditorialNavigation } from "./editorial/NavigationContext";
import {ContentContext,type ContentLink} from './editorial/ContentContext';
const data=JSON.parse(document.getElementById("page-data")?.textContent||"null") as {page:EditorialPage|null;hasEditorial:boolean;content?:ContentLink[]}|null;
const root=document.getElementById("root")!;
async function start() {
 let content;
 if(data?.page) { const Editorial=(await import("./editorial/EditorialApp")).default; content=<Editorial page={data.page}/>; }
 else { const App=(await import("./App")).default; content=<App/>; }
 const view=<BrowserRouter><ContentContext.Provider value={data?.content||[]}><EditorialNavigation.Provider value={!!data?.hasEditorial}>{content}</EditorialNavigation.Provider></ContentContext.Provider></BrowserRouter>;
 if(root.hasChildNodes()) hydrateRoot(root,view); else createRoot(root).render(view);
}
void start();
