import {
  Cloud,
  Cpu,
  Globe,
  Layers,
  Radio,
  Server,
  Shield,
  Smartphone,
  Tv,
  Zap,
} from 'lucide-react';
import type { ComponentType } from 'react';

export const PRODUCT_ICON_OPTIONS = [
  'Radio',
  'Server',
  'Cpu',
  'Smartphone',
  'Globe',
  'Shield',
  'Zap',
  'Layers',
  'Tv',
  'Cloud',
] as const;

const ICON_MAP: Record<string, ComponentType<{ className?: string }>> = {
  Radio,
  Server,
  Cpu,
  Smartphone,
  Globe,
  Shield,
  Zap,
  Layers,
  Tv,
  Cloud,
};

export function ProductIcon({
  name,
  className = 'h-4 w-4',
}: {
  name: string;
  className?: string;
}) {
  const Icon = ICON_MAP[name] || Radio;
  return <Icon className={className} />;
}
