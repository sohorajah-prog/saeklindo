import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const ServiceCard = ({ service, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={service.image} 
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <h3 className="absolute bottom-4 left-6 text-2xl font-bold text-white">
          {service.title}
        </h3>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <p className="text-sm leading-relaxed mb-6">
          {service.description}
        </p>
        
        {service.benefits && service.benefits.length > 0 && (
          <div className="mb-6">
            <span className="text-sm font-semibold mb-3 block">Key Benefits:</span>
            <ul className="space-y-2">
              {service.benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="mt-auto">
          <Button 
            asChild 
            className="w-full"
          >
            <a 
              href={`https://wa.me/6289670691999?text=Hi, I'm interested in ${service.title}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Get Started
            </a>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;