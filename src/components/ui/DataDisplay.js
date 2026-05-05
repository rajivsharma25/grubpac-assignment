import { cn } from '@/utils/cn';

export function Card({ children, className }) {
  return (
    <div className={cn(
      'bg-card text-card-foreground border border-border rounded-2xl shadow-sm overflow-hidden transition-all duration-200',
      className
    )}>
      {children}
    </div>
  );
}

export function Badge({ children, variant = 'neutral' }) {
  const variants = {
    neutral: 'bg-muted text-muted-foreground',
    success: 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20',
    warning: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20',
    error: 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20',
    info: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
  };

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider',
      variants[variant]
    )}>
      {children}
    </span>
  );
}
