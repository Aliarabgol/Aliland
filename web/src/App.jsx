import { Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import { Toast, BackToTop, ScrollRestore } from './components/ui.jsx';
import { useI18n } from './lib/i18n.jsx';

import Home from './pages/Home.jsx';
import Vehicles from './pages/Vehicles.jsx';
import VehicleDetail from './pages/VehicleDetail.jsx';
import Compare from './pages/Compare.jsx';
import Favorites from './pages/Favorites.jsx';
import Services from './pages/Services.jsx';
import ServiceDetail from './pages/ServiceDetail.jsx';
import Sell from './pages/Sell.jsx';
import Partnership from './pages/Partnership.jsx';
import Founder from './pages/Founder.jsx';
import About from './pages/About.jsx';
import Journal from './pages/Journal.jsx';
import Article from './pages/Article.jsx';
import Contact from './pages/Contact.jsx';
import { StaticPage, FaqPage, NotFound } from './pages/Static.jsx';

import AdminLayout from './admin/AdminLayout.jsx';
import Dashboard from './admin/Dashboard.jsx';
import VehiclesAdmin from './admin/VehiclesAdmin.jsx';
import ArticlesAdmin from './admin/ArticlesAdmin.jsx';
import ContentAdmin from './admin/ContentAdmin.jsx';
import MediaAdmin from './admin/MediaAdmin.jsx';

function PublicLayout() {
  const { t } = useI18n();
  return (
    <>
      <a className="skip-link" href="#main">
        {t('shell.skip')}
      </a>
      <ScrollRestore />
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <Toast />
      <BackToTop />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="vehicles" element={<Vehicles />} />
        <Route path="vehicles/:category" element={<Vehicles />} />
        <Route path="vehicle/:slug" element={<VehicleDetail />} />
        <Route path="compare" element={<Compare />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="services" element={<Services />} />
        <Route path="services/:slug" element={<ServiceDetail />} />
        <Route path="sell" element={<Sell />} />
        <Route path="partnership" element={<Partnership />} />
        <Route path="founder" element={<Founder />} />
        <Route path="about" element={<About />} />
        <Route path="journal" element={<Journal />} />
        <Route path="journal/:slug" element={<Article />} />
        <Route path="faq" element={<FaqPage />} />
        <Route path="contact" element={<Contact />} />
        <Route path="privacy" element={<StaticPage kind="privacy" />} />
        <Route path="terms" element={<StaticPage kind="terms" />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="vehicles" element={<VehiclesAdmin />} />
        <Route path="articles" element={<ArticlesAdmin />} />
        <Route path="content" element={<ContentAdmin />} />
        <Route path="media" element={<MediaAdmin />} />
      </Route>
    </Routes>
  );
}
