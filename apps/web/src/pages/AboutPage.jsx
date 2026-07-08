
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
  const { t, language } = useTranslation();
  const [content, setContent] = useState({
    deskripsi: '',
    deskripsi_en: '',
    visi: '',
    visi_en: '',
    misi: '',
    misi_en: '',
    imageUrl: 'https://images.unsplash.com/photo-1510130987633-2a82b350a9c2'
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
          let imageUrl = content.imageUrl;
          if (records[0].image_file) {
            imageUrl = pb.files.getURL(records[0], records[0].image_file);
          }
          setContent(prev => ({ ...prev, ...data, imageUrl }));
        }
      } catch (error) {
        console.error("Error fetching about content", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAboutContent();
  }, []);

  const currentDesc = language === 'en' && content.deskripsi_en ? content.deskripsi_en : content.deskripsi;
  const currentVisi = language === 'en' && content.visi_en ? content.visi_en : content.visi;
  const currentMisi = language === 'en' && content.misi_en ? content.misi_en : content.misi;

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
                  src={content.imageUrl} 
                  alt="Professional team meeting"
                  className="rounded-2xl shadow-lg w-full h-auto aspect-video object-cover"
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
                    {currentDesc || t('about.description')}
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
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-primary/10 rounded-xl flex-shrink-0 w-14 h-14 flex items-center justify-center">
                    <Eye className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">{t('about.vision')}</h2>
                </div>
                {loading ? (
                  <div className="pl-[72px]">
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : (
                  <div 
                    className="pl-[72px] text-base leading-relaxed text-muted-foreground prose prose-sm prose-p:my-0 prose-ul:my-0 max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: currentVisi }}
                  />
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-card text-card-foreground rounded-2xl p-8 shadow-lg"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-primary/10 rounded-xl flex-shrink-0 w-14 h-14 flex items-center justify-center">
                    <Target className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">{t('about.mission')}</h2>
                </div>
                {loading ? (
                  <div className="pl-[72px]">
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : (
                  <div 
                    className="pl-[72px] text-base leading-relaxed text-muted-foreground prose prose-sm prose-p:my-0 prose-ul:my-0 max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: currentMisi }}
                  />
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
