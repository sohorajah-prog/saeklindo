
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import pb from '@/lib/pocketbaseClient.js';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ClientCard from '@/components/ClientCard.jsx';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/hooks/useTranslation.js';

const ClientsPage = () => {
  const { t } = useTranslation();
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const records = await pb.collection('clients').getFullList({
          sort: '-created',
          $autoCancel: false
        });
        setClients(records);
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  return (
    <>
      <Helmet>
        <title>{t('clients.title')} - Saeklindo</title>
        <meta name="description" content={t('clients.description')} />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 bg-background">
          <section className="py-20 md:py-24 bg-muted/30 border-b">
            <div className="max-w-7xl mx-auto container-padding text-center">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
              >
                {t('clients.title')}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
              >
                {t('clients.description')}
              </motion.p>
            </div>
          </section>

          <section className="py-16 md:py-24">
            <div className="max-w-7xl mx-auto container-padding">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="bg-card border rounded-2xl p-6 shadow-sm">
                      <Skeleton className="h-32 w-full rounded-xl mb-6" />
                      <Skeleton className="h-6 w-3/4 mb-3" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-5/6 mb-2" />
                      <Skeleton className="h-4 w-4/6" />
                    </div>
                  ))}
                </div>
              ) : clients.length === 0 ? (
                <div className="text-center py-20 flex flex-col items-center justify-center border-2 border-dashed rounded-2xl bg-muted/10">
                  <Building2 className="w-16 h-16 text-muted-foreground/30 mb-6" />
                  <h2 className="text-2xl font-semibold mb-2">{t('clients.noClients')}</h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    {t('clients.noClientsDesc')}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {clients.map((client, index) => (
                    <ClientCard key={client.id} client={client} index={index} />
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ClientsPage;
