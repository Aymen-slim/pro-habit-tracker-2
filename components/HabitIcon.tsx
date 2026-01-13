import React from 'react';
import { ICON_MAP } from '../constants';

interface HabitIconProps {
  iconKey: string;
  size?: number;
}

export const HabitIcon: React.FC<HabitIconProps> = ({ iconKey, size = 20 }) => {
  const icon = ICON_MAP[iconKey];

  if (icon && React.isValidElement(icon)) {
    return <>{React.cloneElement(icon as React.ReactElement, { size })}</>;
  }

  return <>{iconKey || null}</>;
};