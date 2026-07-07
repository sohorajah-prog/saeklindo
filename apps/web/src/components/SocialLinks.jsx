
import React from 'react';
import { Instagram, Music2, MessageCircle } from 'lucide-react';

const SocialLinks = ({ className = "" }) => {
  const socialLinks = [
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://instagram.com/saeklindo.official',
      label: '@saeklindo.official'
    },
    {
      name: 'TikTok',
      icon: Music2,
      url: 'https://tiktok.com/@saeklindo.official',
      label: '@saeklindo.official'
    }
  ];

  return (
    <div className={`flex gap-4 ${className}`}>
      {socialLinks.map((social) => {
        const Icon = social.icon;
        return (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm hover:text-primary transition-all duration-200"
            aria-label={social.name}
          >
            <Icon className="w-5 h-5" />
            <span className="hidden sm:inline">{social.label}</span>
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinks;
