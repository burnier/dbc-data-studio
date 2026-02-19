import { ReactNode } from 'react';
import { Input } from '@/components/ui/input';

interface NumberInputFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  description: string;
  icon?: ReactNode;
}

export function NumberInputField({
  id,
  label,
  value,
  onChange,
  placeholder,
  description,
  icon,
}: NumberInputFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {icon && <span className="inline mr-1" aria-hidden="true">{icon}</span>}
        {label}
      </label>
      <Input
        id={id}
        type="number"
        step="0.01"
        min="0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-describedby={`${id}-desc`}
      />
      <p id={`${id}-desc`} className="sr-only">{description}</p>
    </div>
  );
}

