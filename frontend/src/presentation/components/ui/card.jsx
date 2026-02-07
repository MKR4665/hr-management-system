import { cn } from '../../../shared/lib/utils';

function Card({ className, ...props }) {
  return (
    <div
      className={cn('rounded-xl border border-brand-100 bg-white/80 shadow-sm backdrop-blur', className)}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }) {
  return <div className={cn('p-6 pb-2', className)} {...props} />;
}

function CardTitle({ className, ...props }) {
  return <h2 className={cn('text-xl font-semibold', className)} {...props} />;
}

function CardContent({ className, ...props }) {
  return <div className={cn('p-6 pt-2', className)} {...props} />;
}

export { Card, CardHeader, CardTitle, CardContent };
