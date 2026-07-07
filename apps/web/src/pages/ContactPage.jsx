
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { MapPin, Phone, Clock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import SocialLinks from '@/components/SocialLinks';
import pb from '@/lib/pocketbaseClient';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/hooks/useTranslation.js';

const ContactPage = () => {
  const { t } = useTranslation();
  const [content, setContent] = useState({
    whatsapp: '+62 896-7069-1999',
    phone: '021-38317003',
    email: 'contact@saeklindo.com',
    alamat: 'Ruko Sentra Kranji, Jl. Bintara No.12f, RT.001/RW.012, Kranji, Kec. Bekasi Bar., Kota Bks, Jawa Barat 17135, Indonesia'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactContent = async () => {
      try {
        const records = await pb.collection('content').getFullList({
          filter: `page="contact" && field="data"`,
          $autoCancel: false
        });
        if (records.length > 0) {
          const data = JSON.parse(records[0].value);
          setContent(prev => ({ ...prev, ...data }));
        }
      } catch (error) {
        console.error("Error fetching contact content", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContactContent();
  }, []);

  const cleanWhatsappLink = content.whatsapp.replace(/\D/g, '');

  const contactInfo = [
    {
      icon: Phone,
      title: 'WhatsApp',
      details: content.whatsapp,
      link: `https://wa.me/${cleanWhatsappLink}`
    }
  ];

  if (content.phone) {
    contactInfo.push({
      icon: Phone,
      title: 'Phone / Landline',
      details: content.phone,
      link: `tel:${content.phone.replace(/[^0-9+]/g, '')}`
    });
  }

  contactInfo.push(
    {
      icon: Mail,
      title: t('form.email'),
      details: content.email,
      link: `mailto:${content.email}`
    },
    {
      icon: MapPin,
      title: t('contact.info'),
      details: content.alamat
    },
    {
      icon: Clock,
      title: t('contact.businessHours'),
      details: t('contact.hoursDetail')
    }
  );

  return (
    <>
      <Helmet>
        <title>{t('contact.title')} - Saeklindo</title>
        <meta name="description" content={t('contact.description')} />
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
                {t('contact.title')}
              </h1>
              <p className="text-lg leading-relaxed text-balance">
                {t('contact.description')}
              </p>
            </motion.div>
          </div>
        </section>

        <section className="section-spacing bg-background">
          <div className="max-w-7xl mx-auto container-padding">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl font-bold mb-6">{t('contact.sendMsg')}</h2>
                <div className="bg-card rounded-2xl p-8 shadow-lg">
                  <ContactForm />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl font-bold mb-6">{t('contact.info')}</h2>
                
                {loading ? (
                  <div className="space-y-6 mb-8">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex gap-4">
                        <Skeleton className="h-12 w-12 rounded-xl" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6 mb-8">
                    {contactInfo.map((info) => {
                      const Icon = info.icon;
                      return (
                        <div key={info.title} className="flex items-start gap-4">
                          <div className="p-3 bg-primary/10 rounded-xl flex-shrink-0">
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-1">{info.title}</h3>
                            {info.link ? (
                              <a 
                                href={info.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm leading-relaxed text-muted-foreground hover:text-primary transition-all duration-200"
                              >
                                {info.details}
                              </a>
                            ) : (
                              <p className="text-sm leading-relaxed text-muted-foreground">
                                {info.details}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="font-semibold mb-4">{t('contact.followUs')}</h3>
                  <SocialLinks />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default ContactPage;
