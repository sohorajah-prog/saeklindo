
import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import GalleryPage from './pages/GalleryPage.jsx';
import ClientsPage from './pages/ClientsPage.jsx';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { LanguageProvider } from '@/contexts/LanguageContext.jsx';

function App() {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected Routes */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            {/* Catch-all */}
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center p-8 bg-card border rounded-2xl shadow-sm max-w-md w-full">
                  <h1 className="text-5xl font-bold mb-4 tracking-tight">404</h1>
                  <p className="text-xl font-medium mb-2">Page Not Found</p>
                  <p className="text-muted-foreground mb-8">The page you're looking for doesn't exist or has been moved.</p>
                  <a href="/" className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                    Back to home
                  </a>
                </div>
              </div>
            } />
          </Routes>
          <Toaster position="bottom-right" />
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;
