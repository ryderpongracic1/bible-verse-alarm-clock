import {format} from 'date-fns';

export const formatTime = (date: Date): string => {
  return format(date, 'HH:mm');
};

export const formatTimeAMPM = (date: Date): string => {
  return format(date, 'h:mm a');
};

export const generateUniqueId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
