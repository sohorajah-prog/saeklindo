
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import SocialLinks from './SocialLinks';
import { useTranslation } from '@/hooks/useTranslation.js';
import pb from '@/lib/pocketbaseClient';

const Footer = () => {
  const { t } = useTranslation();
  const [contactData, setContactData] = useState({
    whatsapp: '+62 896-7069-1999',
    phone: '021-38317003',
    alamat: 'Ruko Sentra Kranji, Jl. Bintara No.12f, RT.001/RW.012, Kranji, Kec. Bekasi Bar., Kota Bks, Jawa Barat 17135, Indonesia'
  });

  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contactRecords, serviceRecords] = await Promise.all([
          pb.collection('content').getFullList({
            filter: `page="contact" && field="data"`,
            $autoCancel: false
          }),
          pb.collection('services').getFullList({
            sort: 'created',
            $autoCancel: false
          })
        ]);

        if (contactRecords.length > 0) {
          const data = JSON.parse(contactRecords[0].value);
          setContactData(prev => ({ ...prev, ...data }));
        }
        
        if (serviceRecords.length > 0) {
          setServices(serviceRecords);
        }
      } catch (error) {
        console.error("Error fetching data for footer:", error);
      }
    };
    fetchData();
  }, []);

  const quickLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.services'), path: '/services' },
    { name: t('nav.gallery'), path: '/gallery' },
    { name: t('nav.clients'), path: '/clients' },
    { name: t('nav.contact'), path: '/contact' }
  ];

  return (
    <footer className="relative bg-secondary text-secondary-foreground border-t overflow-hidden">
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] bg-no-repeat bg-center bg-contain"
        style={{ backgroundImage: 'url("https://horizons-cdn.hostinger.com/0fbf01b6-28c7-4623-ba2e-62114b48b0f6/b439283246ab46f18acfac7d6df67b60.png")' }}
      ></div>
      <div className="relative z-10 max-w-7xl mx-auto container-padding section-spacing">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <img 
              src="https://horizons-cdn.hostinger.com/0fbf01b6-28c7-4623-ba2e-62114b48b0f6/b439283246ab46f18acfac7d6df67b60.png" 
              alt="Saeklindo" 
              className="h-12 w-auto mb-4"
            />
            <p className="text-sm leading-relaxed text-secondary-foreground/80">
              {t('footer.brandDesc')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <span className="font-semibold text-base mb-4 block">{t('footer.quickLinks')}</span>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className="text-sm hover:text-primary transition-all duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <span className="font-semibold text-base mb-4 block">{t('nav.services')}</span>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.id}>
                  <Link 
                    to="/services" 
                    className="text-sm hover:text-primary transition-all duration-200 text-secondary-foreground/80"
                  >
                    {service.nama}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <span className="font-semibold text-base mb-4 block">{t('footer.contact')}</span>
            <ul className="space-y-3 text-secondary-foreground/80">
              <li className="flex items-start gap-2 text-sm">
                <MessageCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <a 
                  href={`https://wa.me/${contactData.whatsapp?.replace(/\D/g, '')}`} 
                  className="hover:text-primary transition-all duration-200 text-secondary-foreground"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {contactData.whatsapp}
                </a>
              </li>
              
              {contactData.phone && (
                <li className="flex items-start gap-2 text-sm">
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <a 
                    href={`tel:${contactData.phone.replace(/[^0-9+]/g, '')}`} 
                    className="hover:text-primary transition-all duration-200 text-secondary-foreground"
                  >
                    {contactData.phone}
                  </a>
                </li>
              )}

              <li className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed">
                  {contactData.alamat}
                </span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <span className="font-semibold text-base mb-4 block">{t('footer.followUs')}</span>
            <SocialLinks className="flex-col items-start" />
          </div>
        </div>

        <div className="mt-12 flex justify-center text-secondary-foreground/70">
          <p className="text-sm text-center">
            © {new Date().getFullYear()} Saeklindo. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
