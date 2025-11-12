import React, { Suspense } from 'react';
import * as LucideIcons from 'lucide-react'; // import everything for the type

type IconName = keyof typeof LucideIcons;

interface Props {
  name: IconName;
  size?: number;
  color?: string;
}

const DynamicIcon: React.FC<Props> = ({ name, size = 24, color = 'currentColor' }) => {
  const LucideIcon = React.lazy(() =>
    import('lucide-react').then(mod => ({
      default: mod[name as keyof typeof mod] as React.ComponentType<any>,
    }))
  );

  return (
    <Suspense fallback={<span style={{ display: 'inline-block', width: size, height: size }} />}>
      <LucideIcon size={size} color={color} />
    </Suspense>
  );
};

export default DynamicIcon;
