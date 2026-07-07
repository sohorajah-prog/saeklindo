
import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GalleryLightbox = ({ isOpen, items, currentIndex, onClose, onNavigate }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate('prev');
      if (e.key === 'ArrowRight') onNavigate('next');
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, onNavigate]);

  if (!isOpen || items.length === 0) return null;

  const currentItem = items[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
        onClick={onClose}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-all z-10"
          aria-label="Close lightbox"
        >
          <X className="w-6 h-6" />
        </button>

        {items.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); onNavigate('prev'); }}
              className="absolute left-4 md:left-8 p-3 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-all z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onNavigate('next'); }}
              className="absolute right-4 md:right-8 p-3 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-all z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </>
        )}

        <div 
          className="relative w-full max-w-5xl max-h-[90vh] px-4 md:px-20 flex flex-col items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.img
            key={currentItem.id || currentItem.imageUrl}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            src={currentItem.imageUrl}
            alt={currentItem.title}
            className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
          />
          
          <div className="mt-6 text-center text-white max-w-2xl">
            <h3 className="text-xl md:text-2xl font-semibold mb-2">{currentItem.title}</h3>
            {currentItem.description && (
              <p className="text-white/70 text-sm md:text-base">{currentItem.description}</p>
            )}
            <div className="mt-3 text-white/50 text-sm">
              {currentIndex + 1} / {items.length}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GalleryLightbox;
