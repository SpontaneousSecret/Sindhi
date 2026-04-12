import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProductProvider } from './context/ProductContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/Dashboard';
import ProductManagement from './pages/admin/ProductManagement';
import CategoryManagement from './pages/admin/CategoryManagement';
import OrderManagement from './pages/admin/OrderManagement';
import FestiveOffers from './pages/admin/FestiveOffers';
import ProtectedRoute from './components/admin/ProtectedRoute';

function App() {
  return (
    <ProductProvider>
      <Router>
        <Routes>
          {/* Public Routes with Layout */}
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/products" element={<Layout><ProductsPage /></Layout>} />
          <Route path="/checkout" element={<Layout><CheckoutPage /></Layout>} />

          {/* Admin Login (No Layout) */}
          <Route path="/admin" element={<AdminLogin />} />

          {/* Protected Admin Routes (No Public Layout) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<ProductManagement />} />
            <Route path="/admin/categories" element={<CategoryManagement />} />
            <Route path="/admin/orders" element={<OrderManagement />} />
            <Route path="/admin/festive-offers" element={<FestiveOffers />} />
          </Route>
        </Routes>
      </Router>
    </ProductProvider>
  );
}

export default App;
