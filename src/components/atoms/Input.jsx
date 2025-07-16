import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

const Input = forwardRef(({ className, type = 'text', ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
className={cn(
        'flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-surface px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-dark-primary/50 focus:border-primary dark:focus:border-dark-primary disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200',
        className
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input;