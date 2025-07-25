import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

const Button = forwardRef(({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
const variants = {
    primary: 'bg-gradient-to-r from-primary to-secondary dark:from-dark-primary dark:to-dark-secondary text-white hover:from-primary/90 hover:to-secondary/90 dark:hover:from-dark-primary/90 dark:hover:to-dark-secondary/90 shadow-lg hover:shadow-xl',
    secondary: 'border-2 border-primary dark:border-dark-primary text-primary dark:text-dark-primary hover:bg-primary hover:text-white dark:hover:bg-dark-primary dark:hover:text-white',
    outline: 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
    ghost: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
    accent: 'bg-gradient-to-r from-accent to-pink-400 dark:from-dark-accent dark:to-pink-500 text-white hover:from-accent/90 hover:to-pink-400/90 dark:hover:from-dark-accent/90 dark:hover:to-pink-500/90 shadow-lg hover:shadow-xl'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      ref={ref}
className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-dark-primary/50 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;