import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string | ReactNode; // Allow ReactNode for title as well for consistency
  description?: string | ReactNode;
  className?: string;
}

export function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <div className={`mb-8 ${className ?? ''}`}> {/* Added nullish coalescing for className */}
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h1>
      {description && (
        <div className="mt-2 text-lg text-muted-foreground"> {/* Changed p to div */}
          {description}
        </div>
      )}
    </div>
  );
}
