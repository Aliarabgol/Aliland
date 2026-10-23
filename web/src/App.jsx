import { Routes, Route } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext.jsx';
import { StoreProvider } from './context/StoreContext.jsx';
import { Layout } from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Cars from './pages/Cars.jsx';
import VehicleDetail from './pages/VehicleDetail.jsx';
import Sell from './pages/Sell.jsx';
import RequestCar from './pages/RequestCar.jsx';
import Compare from './pages/Compare.jsx';
import Favorites from './pages/Favorites.jsx';
import { Journal, Article } from './pages/Journal.jsx';
import Contact from './pages/Contact.jsx';
import { About, Faq, Terms, Privacy, NotFound } from './pages/Static.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminLayout from './pages/admin/AdminLayout.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminVehicles from './pages/admin/AdminVehicles.jsx';
import AdminVehicleEdit from './pages/admin/AdminVehicleEdit.jsx';
import AdminLeads from './pages/admin/AdminLeads.jsx';
import AdminLeadDetail from './pages/admin/AdminLeadDetail.jsx';
import AdminSettings from './pages/admin/AdminSettings.jsx';
import AdminArticles from './pages/admin/AdminArticles.jsx';
import AdminStaff from './pages/admin/AdminStaff.jsx';

export default function App() {
  return (
    <SettingsProvider>
      <StoreProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="cars" element={<Cars />} />
            <Route path="cars/:slug" element={<VehicleDetail />} />
            <Route path="sell" element={<Sell />} />
            <Route path="request-car" element={<RequestCar />} />
            <Route path="compare" element={<Compare />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="journal" element={<Journal />} />
            <Route path="journal/:slug" element={<Article />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="faq" element={<Faq />} />
            <Route path="terms" element={<Terms />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route path="admin/login" element={<AdminLogin />} />
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="vehicles" element={<AdminVehicles />} />
            <Route path="vehicles/new" element={<AdminVehicleEdit />} />
            <Route path="vehicles/:id" element={<AdminVehicleEdit />} />
            <Route path="leads" element={<AdminLeads />} />
            <Route path="leads/:id" element={<AdminLeadDetail />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="articles" element={<AdminArticles />} />
            <Route path="staff" element={<AdminStaff />} />
          </Route>
        </Routes>
      </StoreProvider>
    </SettingsProvider>
  );
}
