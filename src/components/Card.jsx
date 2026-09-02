import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({
  children,
  className = '',
  hoverEffect = false,
  onClick,
  ...props
}) => {
  const CardElement = hoverEffect || onClick ? motion.div : 'div';

  const motionProps = (hoverEffect || onClick) ? {
    whileHover: { y: -4, transition: { duration: 0.25, ease: 'easeOut' } },
    whileTap: onClick ? { scale: 0.99 } : undefined,
  } : {};

  return (
    <CardElement
      onClick={onClick}
      className={`bg-surface rounded-3xl p-8 sm:p-10 md:p-14 shadow-teal-card border-2 border-primary/20 backdrop-blur-sm ${onClick ? 'cursor-pointer' : ''} ${className}`}
      {...motionProps}
      {...props}
    >
      {children}
    </CardElement>
  );
};

export default Card;
