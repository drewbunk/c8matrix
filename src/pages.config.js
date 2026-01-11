import About from './pages/About';
import Admin from './pages/Admin';
import Home from './pages/Home';
import InvestorContact from './pages/InvestorContact';
import Portfolio from './pages/Portfolio';
import ProjectDetails from './pages/ProjectDetails';
import Resume from './pages/Resume';
import Bookings from './pages/Bookings';
import PayForServices from './pages/PayForServices';
import PaymentSuccess from './pages/PaymentSuccess';
import BlogAdmin from './pages/BlogAdmin';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import BookCall from './pages/BookCall';
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
    "PayForServices": PayForServices,
    "PaymentSuccess": PaymentSuccess,
    "BlogAdmin": BlogAdmin,
    "Blog": Blog,
    "BlogPost": BlogPost,
    "BookCall": BookCall,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};