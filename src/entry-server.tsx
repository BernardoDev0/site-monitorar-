import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./App";
import EditorialApp from "./editorial/EditorialApp";
import type { EditorialPage } from "./editorial/types";
import { EditorialNavigation } from "./editorial/NavigationContext";
import {ContentContext,type ContentLink} from './editorial/ContentContext';
export function render(url:string,page:EditorialPage|null,hasEditorial=false,content:ContentLink[]=[]) {
 return renderToString(<StaticRouter location={url}><ContentContext.Provider value={content}><EditorialNavigation.Provider value={hasEditorial}>{page?<EditorialApp page={page}/>:<App/>}</EditorialNavigation.Provider></ContentContext.Provider></StaticRouter>);
}
