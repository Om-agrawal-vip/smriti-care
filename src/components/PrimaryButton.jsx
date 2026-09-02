import React from 'react';
import { motion } from 'framer-motion';

export const PrimaryButton = ({
  children,
  onClick,
  variant = 'primary', // 'primary' | 'secondary' | 'warning' | 'outline'
  className = '',
  disabled = false,
  type = 'button',
  icon: Icon,
  ...props
}) => {
  const variantStyles = {
    primary:
      'bg-primary hover:bg-[#3D6969] text-white shadow-[0_12px_28px_-4px_rgba(74,124,124,0.38)] active:shadow-none border-2 border-primary hover:border-[#3D6969]',
    secondary:
      'bg-secondary hover:bg-[#7D9665] text-white shadow-[0_12px_28px_-4px_rgba(143,168,118,0.4)] active:shadow-none border-2 border-secondary hover:border-[#7D9665]',
    warning:
      'bg-warning hover:bg-[#D99668] text-white shadow-[0_12px_28px_-4px_rgba(232,168,124,0.4)] active:shadow-none border-2 border-warning hover:border-[#D99668]',
    outline:
      'bg-surface hover:bg-primary/10 text-primary border-2 border-primary/40 shadow-sm',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.03 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 450, damping: 22 }}
      className={`min-h-[56px] py-4 px-8 rounded-2xl font-bold text-lg md:text-xl tracking-wide inline-flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-normal break-words text-center leading-snug max-w-full ${
        variantStyles[variant] || variantStyles.primary
      } ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-6 h-6 stroke-[2.4] flex-shrink-0" />}
      <span className="font-bold break-words">{children}</span>
    </motion.button>
  );
};

export default PrimaryButton;
