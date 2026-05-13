import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : {}}
      className={`bg-card text-card-foreground border border-border rounded-xl p-6 shadow-sm ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Card;
