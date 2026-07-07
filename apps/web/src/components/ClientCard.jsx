
import React from 'react';
import { motion } from 'framer-motion';
import pb from '@/lib/pocketbaseClient.js';

const ClientCard = ({ client, index = 0 }) => {
  const logoUrl = client.logo ? pb.files.getURL(client, client.logo) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-card text-card-foreground rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col h-full border border-border/50"
    >
      <div className="mb-6 h-32 w-full flex items-center justify-center overflow-hidden bg-muted/30 rounded-xl p-4">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={`${client.name} logo`}
            className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500 ease-out"
          />
        ) : (
          <span className="text-muted-foreground font-medium text-lg text-center px-4">
            {client.name}
          </span>
        )}
      </div>
      <div className="flex-grow flex flex-col">
        <h3 className="text-xl font-bold mb-3 tracking-tight">{client.name}</h3>
        <p className="text-muted-foreground leading-relaxed text-sm line-clamp-3">
          {client.description}
        </p>
      </div>
    </motion.div>
  );
};

export default ClientCard;
