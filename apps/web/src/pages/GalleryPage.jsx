
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Image as ImageIcon, RefreshCcw } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import GalleryCard from '@/components/GalleryCard.jsx';
import GalleryLightbox from '@/components/GalleryLightbox.jsx';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import pb from '@/lib/pocketbaseClient';
import { useTranslation } from '@/hooks/useTranslation.js';

const SAMPLE_IMAGES = [
  { id: 's1', title: 'Professional Cleaning', category: 'Cleaning', imageUrl: 'https://images.unsplash.com/photo-1699109076552-58db1cccae82' },
  { id: 's2', title: 'Security Patrol', category: 'Security', imageUrl: 'https://images.unsplash.com/photo-1670064161367-4c605010ac37' },
  { id: 's3', title: 'Executive Driver', category: 'Driver', imageUrl: 'https://images.unsplash.com/photo-1492724219889-989d2306de19' },
  { id: 's4', title: 'Office Maintenance', category: 'Cleaning', imageUrl: 'https://images.unsplash.com/photo-1602455570864-1009e131c1bc' },
  { id: 's5', title: 'Household Staff', category: 'Pramubakti', imageUrl: 'https://images.unsplash.com/photo-1575261569688-399dd464cd13' },
  { id: 's6', title: 'Commercial Security', category: 'Security', imageUrl: 'https://images.unsplash.com/photo-1657779554500-3cc9472ae134' }
];

const GalleryPage = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchGallery = async () => {
    setLoading(true);
    setError(null);
    try {
      const records = await pb.collection('gallery').getList(1, 50, {
        sort: '-created',
        $autoCancel: false
      });
      
      if (records.items.length > 0) {
        const formattedItems = records.items.map(record => ({
          id: record.id,
          title: record.title,
          description: record.description,
          category: record.category,
          imageUrl: pb.files.getURL(record, record.image)
        }));
        setItems(formattedItems);
      } else {
        setItems(SAMPLE_IMAGES);
      }
    } catch (err) {
      console.error('Error fetching gallery:', err);
      setError(t('gallery.noImages'));
      setItems(SAMPLE_IMAGES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const openLightbox = (item) => {
    const index = items.findIndex(i => i.id === item.id);
    setCurrentIndex(index >= 0 ? index : 0);
    setLightboxOpen(true);
  };

  const handleNavigate = (direction) => {
    if (direction === 'prev') {
      setCurrentIndex(prev => (prev > 0 ? prev - 1 : items.length - 1));
    } else {
      setCurrentIndex(prev => (prev < items.length - 1 ? prev + 1 : 0));
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('gallery.title')} - Saeklindo</title>
        <meta name="description" content={t('gallery.description')} />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-1">
          <section className="bg-secondary py-16 md:py-24 border-b">
            <div className="max-w-7xl mx-auto container-padding text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-secondary-foreground">{t('gallery.title')}</h1>
                <p className="text-lg text-secondary-foreground/80 max-w-2xl mx-auto">
                  {t('gallery.description')}
                </p>
              </motion.div>
            </div>
          </section>

          <section className="section-spacing">
            <div className="max-w-7xl mx-auto container-padding">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <Skeleton key={i} className="aspect-[4/3] w-full rounded-2xl" />
                  ))}
                </div>
              ) : error && items.length === 0 ? (
                <div className="text-center py-20">
                  <ImageIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">{t('gallery.noImages')}</h3>
                  <p className="text-muted-foreground mb-6">{error}</p>
                  <Button onClick={fetchGallery} variant="outline">
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    {t('gallery.tryAgain')}
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                    >
                      <GalleryCard item={item} onClick={openLightbox} />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>

        <Footer />

        <GalleryLightbox
          isOpen={lightboxOpen}
          items={items}
          currentIndex={currentIndex}
          onClose={() => setLightboxOpen(false)}
          onNavigate={handleNavigate}
        />
      </div>
    </>
  );
};

export default GalleryPage;
