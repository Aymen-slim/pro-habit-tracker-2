import React from 'react';
import { ICON_MAP } from '../constants';

interface HabitIconProps {
  iconKey: string;
}

export const HabitIcon: React.FC<HabitIconProps> = ({ iconKey }) => {
  return <>{ICON_MAP[iconKey] || null}</>;
};