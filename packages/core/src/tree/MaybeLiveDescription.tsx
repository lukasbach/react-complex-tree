import * as React from 'react';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';
import { LiveDescription } from './LiveDescription';

export const MaybeLiveDescription: React.FC = () => {
  const env = useTreeEnvironment();

  if (!(env.showLiveDescription ?? true)) {
    return null;
  }

  return <LiveDescription />;
};
