import { cn } from '@/utils/cn';

export function Input({ label, error, className, ...props }) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full px-4 py-2 bg-background border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {error && <p className="text-[10px] font-medium text-red-500 mt-1">{error}</p>}
    </div>
  );
}
