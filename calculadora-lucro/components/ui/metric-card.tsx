interface MetricCardProps {
  label: string;
  value: string;
  colorClass: string;
  borderColorClass: string;
  textColorClass: string;
  subtitle?: string;
  footer?: string;
}

export function MetricCard({
  label,
  value,
  colorClass,
  borderColorClass,
  textColorClass,
  subtitle,
  footer,
}: MetricCardProps) {
  return (
    <div className={`p-6 rounded-lg ${colorClass} border-2 ${borderColorClass}`}>
      <div className="text-sm text-gray-600 mb-1">
        {label}
        {subtitle && <span className={`text-xs ml-1 ${textColorClass}`}>{subtitle}</span>}
      </div>
      <div className={`text-3xl font-bold ${textColorClass}`}>
        {value}
      </div>
      {footer && <p className={`text-xs ${textColorClass} mt-1`}>{footer}</p>}
    </div>
  );
}

