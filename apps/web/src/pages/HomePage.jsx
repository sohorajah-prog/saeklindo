
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Car, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import pb from '@/lib/pocketbaseClient';
import { Skeleton } from '@/components/ui/skeleton';
import VideoPlayer from '@/components/VideoPlayer';
import { useTranslation } from '@/hooks/useTranslation.js';

const HomePage = () => {
  const { t } = useTranslation();
  const [content, setContent] = useState({
    tagline: '',
    deskripsi: '',
    services: [],
    videoUrl: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeContent = async () => {
      try {
        const records = await pb.collection('content').getFullList({
          filter: `(page="hero" || page="services") && field="data"`,
          $autoCancel: false
        });
        
        let newContent = { ...content };
        records.forEach(record => {
          const data = JSON.parse(record.value);
          if (record.page === 'hero') {
            newContent.tagline = data.tagline;
            newContent.deskripsi = data.deskripsi;
            if (record.video_file) {
              newContent.videoUrl = pb.files.getURL(record, record.video_file);
            }
          } else if (record.page === 'services') {
            newContent.services = data;
          }
        });
        setContent(newContent);
      } catch (error) {
        console.error("Error fetching homepage content", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeContent();
  }, []);

  const getIconForService = (title) => {
    const tStr = title.toLowerCase();
    if (tStr.includes('clean')) return Sparkles;
    if (tStr.includes('secur')) return Shield;
    if (tStr.includes('driv')) return Car;
    return Users;
  };

  const defaultServices = [
    { nama: t('services.items.cleaning'), deskripsi: 'Professional cleaning solutions...', icon: Sparkles },
    { nama: t('services.items.security'), deskripsi: 'Reliable security personnel...', icon: Shield },
    { nama: t('services.items.driver'), deskripsi: 'Experienced professional drivers...', icon: Car },
    { nama: t('services.items.pramubakti'), deskripsi: 'Dedicated household staff...', icon: Users }
  ];

  const displayServices = content.services.length > 0 
    ? content.services.slice(0, 4).map(s => ({ ...s, icon: getIconForService(s.nama) }))
    : defaultServices;

  const fallbackHeroImage = "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop";

  return (
    <>
      <Helmet>
        <title>Saeklindo - {t('hero.tagline')} | Professional Service Solutions</title>
        <meta name="description" content={t('hero.description')} />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          <VideoPlayer 
            videoUrl={content.videoUrl} 
            fallbackImage={fallbackHeroImage} 
          />
          
          <div className="max-w-7xl mx-auto container-padding relative z-10 py-20 w-full text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center w-full max-w-4xl mx-auto"
            >
              {loading ? (
                <div className="flex flex-col items-center gap-4 mb-8">
                  <Skeleton className="h-16 w-3/4 bg-white/20" />
                  <Skeleton className="h-20 w-full max-w-2xl mt-6 bg-white/20" />
                </div>
              ) : (
                <>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-balance drop-shadow-md" style={{letterSpacing: '-0.02em'}}>
                    {content.tagline || t('hero.tagline')}
                  </h1>
                  <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed text-balance drop-shadow font-medium text-white/90">
                    {content.deskripsi || t('hero.description')}
                  </p>
                </>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 transition-all duration-300" asChild>
                  <a 
                    href="https://wa.me/6289670691999" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {t('hero.contactBtn')}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </a>
                </Button>
                <Button 
                  size="lg" 
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 hover:border-white transition-all duration-300 drop-shadow-md" 
                  asChild
                >
                  <Link to="/services">
                    {t('hero.servicesBtn')}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="section-spacing bg-background">
          <div className="max-w-7xl mx-auto container-padding">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t('services.title')}
              </h2>
              <p className="text-lg max-w-2xl mx-auto leading-relaxed text-muted-foreground">
                {t('services.description')}
              </p>
            </motion.div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map(i => (
                  <Skeleton key={i} className="h-48 w-full rounded-2xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {displayServices.map((service, index) => {
                  const Icon = service.icon;
                  return (
                    <motion.div
                      key={service.nama}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Link 
                        to="/services"
                        className="group block bg-card rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full border border-border hover:border-primary/50"
                      >
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-all duration-300">
                            <Icon className="w-8 h-8 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-all duration-200">
                              {service.nama}
                            </h3>
                            <p className="text-sm leading-relaxed mb-4 text-muted-foreground">
                              {service.deskripsi}
                            </p>
                            <span className="text-sm font-medium text-primary inline-flex items-center gap-1">
                              {t('services.learnMore')}
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center mt-12"
            >
              <Button size="lg" asChild>
                <Link to="/services">
                  {t('services.viewAll')}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default HomePage;
