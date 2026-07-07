
import React from 'react';
import { motion } from 'framer-motion';
import { Maximize2 } from 'lucide-react';

const GalleryCard = ({ item, onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-2xl bg-muted cursor-pointer aspect-[4/3] shadow-sm hover:shadow-xl transition-all duration-300"
      onClick={() => onClick(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(item);
        }
      }}
      aria-label={`View ${item.title}`}
    >
      <img
        src={item.imageUrl}
        alt={item.title}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      
      <div className="absolute inset-0 gallery-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          {item.category && (
            <span className="inline-block px-3 py-1 bg-primary/90 text-primary-foreground text-xs font-medium rounded-full mb-2 backdrop-blur-sm">
              {item.category}
            </span>
          )}
          <h3 className="text-white font-semibold text-lg leading-tight mb-1">
            {item.title}
          </h3>
          {item.description && (
            <p className="text-white/80 text-sm line-clamp-2">
              {item.description}
            </p>
          )}
        </div>
      </div>

      <div className="absolute top-4 right-4 w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Maximize2 className="w-5 h-5 text-white" />
      </div>
    </motion.div>
  );
};

export default GalleryCard;
