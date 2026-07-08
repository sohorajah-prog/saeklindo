import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import pb from '@/lib/pocketbaseClient';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/hooks/useTranslation.js';
import { Briefcase, MapPin, Clock, ArrowRight } from 'lucide-react';

const CareersPage = () => {
  const { t, language } = useTranslation();
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const records = await pb.collection('careers').getFullList({
          filter: 'isActive = true',
          sort: '-created',
          $autoCancel: false
        });
        
        const formatted = records.map(c => {
          const title = language === 'en' && c.title_en ? c.title_en : c.title;
          const description = language === 'en' && c.description_en ? c.description_en : c.description;
          const requirements = language === 'en' && c.requirements_en ? c.requirements_en : c.requirements;
          const type = language === 'en' && c.type_en ? c.type_en : c.type;
          
          return {
            id: c.id,
            title,
            description,
            requirements,
            type,
            location: c.location,
            applyUrl: c.applyUrl,
          };
        });
        
        setCareers(formatted);
      } catch (error) {
        console.error('Error fetching careers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCareers();
  }, [t, language]);

  return (
    <>
      <Helmet>
        <title>{t('careers.title')} - Saeklindo</title>
        <meta name="description" content={t('careers.description')} />
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
                {t('careers.title')}
              </h1>
              <p className="text-lg leading-relaxed text-balance text-muted-foreground">
                {t('careers.description')}
              </p>
            </motion.div>
          </div>
        </section>

        <section className="section-spacing bg-background flex-1">
          <div className="max-w-4xl mx-auto container-padding">
            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-48 w-full rounded-2xl" />
                ))}
              </div>
            ) : careers.length > 0 ? (
              <div className="space-y-6">
                {careers.map((career, index) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    key={career.id} 
                    className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow group"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                      <div className="flex-1 space-y-4">
                        <div className="space-y-2">
                          <h3 className="text-2xl font-bold tracking-tight text-foreground">{career.title}</h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-muted-foreground">
                            {career.type && (
                              <span className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full">
                                <Clock className="w-4 h-4" />
                                {career.type}
                              </span>
                            )}
                            {career.location && (
                              <span className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4" />
                                {career.location}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="space-y-4 text-muted-foreground">
                          <p className="leading-relaxed">{career.description}</p>
                          
                          {career.requirements && (
                            <div className="pt-2">
                              <h4 className="font-semibold text-foreground mb-2">{t('form.requirements')}:</h4>
                              <p className="leading-relaxed whitespace-pre-wrap text-sm">{career.requirements}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 pt-2 md:pt-0">
                        {career.applyUrl ? (
                          <a 
                            href={career.applyUrl.includes('@') && !career.applyUrl.startsWith('mailto:') ? `mailto:${career.applyUrl}` : career.applyUrl}
                            target={career.applyUrl.startsWith('http') ? '_blank' : '_self'}
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium shadow-sm hover:bg-primary/90 transition-colors w-full md:w-auto"
                          >
                            {t('careers.applyNow')}
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </a>
                        ) : (
                          <span className="inline-flex items-center justify-center bg-muted text-muted-foreground px-6 py-3 rounded-xl font-medium w-full md:w-auto">
                            Hanya Informasi
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed">
                <Briefcase className="w-16 h-16 mx-auto mb-6 text-muted-foreground/30" />
                <h3 className="text-2xl font-semibold mb-2">{t('careers.noCareers')}</h3>
                <p className="text-muted-foreground max-w-md mx-auto">{t('careers.noCareersDesc')}</p>
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default CareersPage;
