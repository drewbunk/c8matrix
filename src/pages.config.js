import About from './pages/About';
import Admin from './pages/Admin';
import Home from './pages/Home';
import Resume from './pages/Resume';
import __Layout from './Layout.jsx';


export const PAGES = {
    "About": About,
    "Admin": Admin,
    "Home": Home,
    "Resume": Resume,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};