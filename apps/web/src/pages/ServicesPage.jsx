
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServiceCard from '@/components/ServiceCard';
import { motion } from 'framer-motion';
import pb from '@/lib/pocketbaseClient';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/hooks/useTranslation.js';

const ServicesPage = () => {
  const { t } = useTranslation();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const records = await pb.collection('services').getFullList({
          sort: 'created',
          $autoCancel: false
        });
        if (records.length > 0) {
          const formatted = records.map(s => ({
            title: s.nama,
            description: s.deskripsi,
            image: s.image ? pb.files.getURL(s, s.image) : 'https://images.unsplash.com/photo-1699109076552-58db1cccae82',
            benefits: s.benefits.split(',').map(b => b.trim()).filter(Boolean)
          }));
          setServices(formatted);
        } else {
          setServices([
            {
              title: t('services.items.cleaning'),
              image: 'https://images.unsplash.com/photo-1699109076552-58db1cccae82',
              description: 'Professional cleaning solutions for residential and commercial spaces.',
              benefits: ['Trained professionals', 'Eco-friendly products']
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [t]);

  return (
    <>
      <Helmet>
        <title>{t('services.title')} - Saeklindo</title>
        <meta name="description" content={t('services.description')} />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <section className="section-spacing bg-gradient-to-br from-primary/5 via-background to-accent/10">
          <div className="max-w-7xl mx-auto container-padding">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-balance" style={{letterSpacing: '-0.02em'}}>
                {t('services.title')}
              </h1>
              <p className="text-lg leading-relaxed text-balance">
                {t('services.description')}
              </p>
            </motion.div>
          </div>
        </section>

        <section className="section-spacing bg-background flex-1">
          <div className="max-w-7xl mx-auto container-padding">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map(i => (
                  <Skeleton key={i} className="h-96 w-full rounded-2xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {services.map((service, index) => (
                  <ServiceCard key={index} service={service} index={index} />
                ))}
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default ServicesPage;
