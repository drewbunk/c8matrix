import About from './pages/About';
import Admin from './pages/Admin';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Resume from './pages/Resume';
import __Layout from './Layout.jsx';


export const PAGES = {
    "About": About,
    "Admin": Admin,
    "Home": Home,
    "Portfolio": Portfolio,
    "Resume": Resume,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};