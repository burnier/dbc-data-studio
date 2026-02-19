interface BreakdownLineProps {
  label: string;
  value: string;
  isNegative?: boolean;
  isTotal?: boolean;
  textColor?: string;
}

export function BreakdownLine({ 
  label, 
  value, 
  isNegative = false, 
  isTotal = false,
  textColor 
}: BreakdownLineProps) {
  const className = isTotal 
    ? "border-t pt-2 flex justify-between font-semibold text-base"
    : "flex justify-between";
  
  const labelClass = isTotal 
    ? textColor || 'text-gray-900'
    : 'text-gray-600';
    
  const valueClass = isTotal
    ? textColor || 'text-gray-900'
    : isNegative 
      ? 'text-red-600' 
      : 'font-semibold text-gray-900';

  return (
    <div className={className}>
      <span className={labelClass}>{label}</span>
      <span className={valueClass}>{isNegative ? '-' : ''}{value}</span>
    </div>
  );
}

