
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Target, Eye, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import pb from '@/lib/pocketbaseClient';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/hooks/useTranslation.js';

const AboutPage = () => {
  const { t } = useTranslation();
  const [content, setContent] = useState({
    deskripsi: '',
    visi: '',
    misi: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const records = await pb.collection('content').getFullList({
          filter: `page="about" && field="data"`,
          $autoCancel: false
        });
        if (records.length > 0) {
          const data = JSON.parse(records[0].value);
          setContent(prev => ({ ...prev, ...data }));
        }
      } catch (error) {
        console.error("Error fetching about content", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAboutContent();
  }, []);

  return (
    <>
      <Helmet>
        <title>{t('about.title')} - Saeklindo</title>
        <meta name="description" content={t('about.description')} />
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
                {t('about.title')}
              </h1>
              <p className="text-lg leading-relaxed text-balance">
                {t('about.description')}
              </p>
            </motion.div>
          </div>
        </section>

        <section className="section-spacing bg-background">
          <div className="max-w-7xl mx-auto container-padding">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1510130987633-2a82b350a9c2" 
                  alt="Professional team meeting"
                  className="rounded-2xl shadow-lg w-full h-auto"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  {t('about.whoWeAre')}
                </h2>
                {loading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-3/4" />
                  </div>
                ) : (
                  <div className="text-base leading-relaxed text-muted-foreground whitespace-pre-line">
                    {content.deskripsi || t('about.description')}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        <section className="section-spacing bg-secondary text-secondary-foreground">
          <div className="max-w-7xl mx-auto container-padding">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-card text-card-foreground rounded-2xl p-8 shadow-lg"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Eye className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">{t('about.vision')}</h2>
                </div>
                {loading ? (
                  <Skeleton className="h-20 w-full" />
                ) : (
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {content.visi}
                  </p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-card text-card-foreground rounded-2xl p-8 shadow-lg"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Target className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">{t('about.mission')}</h2>
                </div>
                {loading ? (
                  <Skeleton className="h-20 w-full" />
                ) : (
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {content.misi}
                  </p>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default AboutPage;
