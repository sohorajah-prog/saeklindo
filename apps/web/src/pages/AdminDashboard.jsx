
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { LayoutDashboard, FileText, Settings, Users, LogOut, Phone, Image as ImageIcon, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext.jsx';
import HeroForm from '@/components/HeroForm.jsx';
import ServicesForm from '@/components/ServicesForm.jsx';
import AboutForm from '@/components/AboutForm.jsx';
import AdminContactForm from '@/components/AdminContactForm.jsx';
import GalleryForm from '@/components/GalleryForm.jsx';
import ClientsForm from '@/components/ClientsForm.jsx';
import { useTranslation } from '@/hooks/useTranslation.js';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('hero');
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tabs = [
    { id: 'hero', label: t('admin.tabs.hero'), icon: LayoutDashboard },
    { id: 'services', label: t('admin.tabs.services'), icon: Users },
    { id: 'about', label: t('admin.tabs.about'), icon: FileText },
    { id: 'gallery', label: t('admin.tabs.gallery'), icon: ImageIcon },
    { id: 'clients', label: t('admin.tabs.clients'), icon: Building2 },
    { id: 'contact', label: t('admin.tabs.contact'), icon: Phone },
  ];

  return (
    <>
      <Helmet>
        <title>{t('admin.title')} - Saeklindo</title>
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-card border-r border-border shrink-0 flex flex-col h-auto md:h-screen sticky top-0 z-10">
          <div className="p-6 border-b">
            <h2 className="font-bold text-xl tracking-tight text-primary">{t('admin.title')}</h2>
            <p className="text-xs text-muted-foreground mt-1 truncate">{currentUser?.email}</p>
          </div>
          
          <nav className="p-4 flex-1 space-y-2 overflow-y-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-foreground/80 hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t">
            <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-3" />
              {t('admin.logout')}
            </Button>
            <Button variant="link" className="w-full justify-start mt-2" onClick={() => navigate('/')}>
              {t('admin.viewSite')}
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-4xl mx-auto">
            <header className="mb-8">
              <h1 className="text-3xl font-bold">
                {tabs.find(t => t.id === activeTab)?.label}
              </h1>
              <p className="text-muted-foreground mt-2">{t('admin.desc')}</p>
            </header>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {activeTab === 'hero' && <HeroForm />}
              {activeTab === 'services' && <ServicesForm />}
              {activeTab === 'about' && <AboutForm />}
              {activeTab === 'gallery' && <GalleryForm />}
              {activeTab === 'clients' && <ClientsForm />}
              {activeTab === 'contact' && <AdminContactForm />}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;
