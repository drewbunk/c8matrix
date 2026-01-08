import About from './pages/About';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Resume from './pages/Resume';
import __Layout from './Layout.jsx';


export const PAGES = {
    "About": About,
    "Home": Home,
    "Admin": Admin,
    "Resume": Resume,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};