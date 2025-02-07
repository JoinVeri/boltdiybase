import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import BusinessList from './components/BusinessList';
import BusinessDetail from './components/BusinessDetail';
import Cities from './components/Cities';
import CityDetails from './components/CityDetails';
import ServiceCategoryDetail from './components/ServiceCategoryDetail';
import Articles from './components/Articles';
import ArticleDetail from './components/ArticleDetail';
import ArticleForm from './components/forms/ArticleForm';
import Deals from './components/Deals';
import DealDetail from './components/DealDetail';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import SignUpSuccess from './components/auth/SignUpSuccess';
import PasswordReset from './components/auth/PasswordReset';
import UpdatePassword from './components/auth/UpdatePassword';
import BusinessOnboarding from './components/auth/BusinessOnboarding';
import CustomerDashboard from './components/dashboards/CustomerDashboard';
import BusinessDashboard from './components/dashboards/BusinessDashboard';
import AdminDashboard from './components/dashboards/AdminDashboard';
import BusinessEditForm from './components/forms/BusinessEditForm';
import FeaturedCities from './components/FeaturedCities';
import VeriLocalServices from './components/VeriLocalServices';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<>
                <FeaturedCities />
                <div className="mt-16">
                  <BusinessList />
                </div>
              </>} />
              <Route path="/businesses" element={<BusinessList />} />
              <Route path="/business/:id" element={<BusinessDetail />} />
              <Route path="/cities" element={<Cities />} />
              <Route path="/city/:id" element={<CityDetails />} />
              <Route path="/services/:slug" element={<ServiceCategoryDetail />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/articles/new" element={<ArticleForm />} />
              <Route path="/articles/:id/edit" element={<ArticleForm />} />
              <Route path="/articles/:id" element={<ArticleDetail />} />
              <Route path="/deals" element={<Deals />} />
              <Route path="/deals/:id" element={<DealDetail />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/signup-success" element={<SignUpSuccess />} />
              <Route path="/forgot-password" element={<PasswordReset />} />
              <Route path="/update-password" element={<UpdatePassword />} />
              <Route path="/onboarding/business" element={<BusinessOnboarding />} />
              <Route path="/dashboard/customer" element={<CustomerDashboard />} />
              <Route path="/dashboard/business" element={<BusinessDashboard />} />
              <Route path="/dashboard/admin" element={<AdminDashboard />} />
              <Route path="/business/edit/:id" element={<BusinessEditForm />} />
              <Route path="/business/services" element={<VeriLocalServices />} />
            </Routes>
          </main>
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;