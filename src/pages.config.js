import About from './pages/About';
import Admin from './pages/Admin';
import Blog from './pages/Blog';
import BlogAdmin from './pages/BlogAdmin';
import BlogPost from './pages/BlogPost';
import BookCall from './pages/BookCall';
import Bookings from './pages/Bookings';
import ClientsAdmin from './pages/ClientsAdmin';
import Home from './pages/Home';
import InvestorContact from './pages/InvestorContact';
import MediaManager from './pages/MediaManager';
import PayForServices from './pages/PayForServices';
import PaymentSuccess from './pages/PaymentSuccess';
import Portfolio from './pages/Portfolio';
import ProjectDetails from './pages/ProjectDetails';
import Resume from './pages/Resume';
import __Layout from './Layout.jsx';


export const PAGES = {
    "About": About,
    "Admin": Admin,
    "Blog": Blog,
    "BlogAdmin": BlogAdmin,
    "BlogPost": BlogPost,
    "BookCall": BookCall,
    "Bookings": Bookings,
    "ClientsAdmin": ClientsAdmin,
    "Home": Home,
    "InvestorContact": InvestorContact,
    "MediaManager": MediaManager,
    "PayForServices": PayForServices,
    "PaymentSuccess": PaymentSuccess,
    "Portfolio": Portfolio,
    "ProjectDetails": ProjectDetails,
    "Resume": Resume,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};