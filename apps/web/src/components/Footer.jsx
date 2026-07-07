
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
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

  useEffect(() => {
    const fetchContactContent = async () => {
      try {
        const records = await pb.collection('content').getFullList({
          filter: `page="contact" && field="data"`,
          $autoCancel: false
        });
        if (records.length > 0) {
          const data = JSON.parse(records[0].value);
          setContactData(prev => ({ ...prev, ...data }));
        }
      } catch (error) {
        console.error("Error fetching contact for footer:", error);
      }
    };
    fetchContactContent();
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
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

          {/* Contact Info */}
          <div>
            <span className="font-semibold text-base mb-4 block">{t('footer.contact')}</span>
            <ul className="space-y-3 text-secondary-foreground/80">
              <li className="flex items-start gap-2 text-sm">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div className="flex flex-col gap-1">
                  <a 
                    href={`https://wa.me/${contactData.whatsapp?.replace(/\D/g, '')}`} 
                    className="hover:text-primary transition-all duration-200 text-secondary-foreground block"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WA: {contactData.whatsapp}
                  </a>
                  {contactData.phone && (
                    <a 
                      href={`tel:${contactData.phone.replace(/[^0-9+]/g, '')}`} 
                      className="hover:text-primary transition-all duration-200 text-secondary-foreground block"
                    >
                      Telp: {contactData.phone}
                    </a>
                  )}
                </div>
              </li>
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

        <div className="border-t border-secondary-foreground/10 mt-12 pt-8 flex justify-center text-secondary-foreground/70">
          <p className="text-sm text-center">
            © {new Date().getFullYear()} Saeklindo. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
