import clsx from 'clsx';

export function Card({ children, className = '', padding = true, hover = false }) {
  return (
    <div
      className={clsx(
        'bg-white rounded-lg shadow-md',
        padding && 'p-6',
        hover && 'transition-shadow hover:shadow-lg',
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={clsx('flex items-start justify-between mb-4', className)}>
      <div>
        {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
        {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
