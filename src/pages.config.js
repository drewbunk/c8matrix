import About from './pages/About';
import Admin from './pages/Admin';
import Home from './pages/Home';
import InvestorContact from './pages/InvestorContact';
import Portfolio from './pages/Portfolio';
import ProjectDetails from './pages/ProjectDetails';
import Resume from './pages/Resume';
import Bookings from './pages/Bookings';
import __Layout from './Layout.jsx';


export const PAGES = {
    "About": About,
    "Admin": Admin,
    "Home": Home,
    "InvestorContact": InvestorContact,
    "Portfolio": Portfolio,
    "ProjectDetails": ProjectDetails,
    "Resume": Resume,
    "Bookings": Bookings,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};