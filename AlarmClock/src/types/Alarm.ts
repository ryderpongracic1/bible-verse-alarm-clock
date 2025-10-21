export interface Alarm {
  id: string;
  time: Date;
  enabled: boolean;
  label: string;
  repeatDays: DayOfWeek[];
  sound: string;
  vibrate: boolean;
  snoozeEnabled: boolean;
  snoozeDuration: number; // in minutes
  // Typing challenge is now always enabled, no configuration needed
}

// Serializable version of Alarm for navigation params
export interface SerializableAlarm {
  id: string;
  time: string; // ISO string instead of Date
  enabled: boolean;
  label: string;
  repeatDays: DayOfWeek[];
  sound: string;
  vibrate: boolean;
  snoozeEnabled: boolean;
  snoozeDuration: number;
  // Typing challenge is now always enabled, no configuration needed
}

// Helper functions to convert between Alarm and SerializableAlarm
export const toSerializableAlarm = (alarm: Alarm): SerializableAlarm => ({
  ...alarm,
  time: alarm.time.toISOString(),
});

export const fromSerializableAlarm = (alarm: SerializableAlarm): Alarm => ({
  ...alarm,
  time: new Date(alarm.time),
});

export enum DayOfWeek {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
}

export const DAY_LABELS: Record<DayOfWeek, string> = {
  [DayOfWeek.Sunday]: 'Sun',
  [DayOfWeek.Monday]: 'Mon',
  [DayOfWeek.Tuesday]: 'Tue',
  [DayOfWeek.Wednesday]: 'Wed',
  [DayOfWeek.Thursday]: 'Thu',
  [DayOfWeek.Friday]: 'Fri',
  [DayOfWeek.Saturday]: 'Sat',
};
