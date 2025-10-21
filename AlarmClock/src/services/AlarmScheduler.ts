import notifee, {
  AndroidImportance,
  RepeatFrequency,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';
import {Alarm, DayOfWeek} from '../types';

export class AlarmScheduler {
  static async scheduleAlarm(alarm: Alarm): Promise<void> {
    if (!alarm.enabled) {
      await this.cancelAlarm(alarm.id);
      return;
    }

    // Create a notification channel for Android
    const channelId = await notifee.createChannel({
      id: 'alarm-channel',
      name: 'Alarms',
      importance: AndroidImportance.HIGH,
      sound: 'alarm_long', // Use longer looped alarm sound (no extension for Android)
      vibration: alarm.vibrate,
    });

    // Calculate the next alarm time
    const now = new Date();
    const alarmTime = new Date(alarm.time);
    let nextAlarmTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      alarmTime.getHours(),
      alarmTime.getMinutes(),
      0,
      0,
    );

    // If the alarm time has passed today, schedule for tomorrow
    if (nextAlarmTime <= now) {
      nextAlarmTime.setDate(nextAlarmTime.getDate() + 1);
    }

    // Handle repeating alarms
    if (alarm.repeatDays.length > 0) {
      // Find the next occurrence based on repeat days
      nextAlarmTime = this.getNextRepeatTime(alarmTime, alarm.repeatDays);
    }

    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: nextAlarmTime.getTime(),
      repeatFrequency:
        alarm.repeatDays.length > 0 ? RepeatFrequency.DAILY : undefined,
    };

    // Schedule the notification
    await notifee.createTriggerNotification(
      {
        id: alarm.id,
        title: 'Alarm',
        body: alarm.label || 'Time to wake up!',
        data: {
          alarmId: alarm.id,
          // Store alarm data as JSON string to pass through notification
          alarmData: JSON.stringify({
            id: alarm.id,
            time: alarm.time.toISOString(),
            enabled: alarm.enabled,
            label: alarm.label,
            repeatDays: alarm.repeatDays,
            sound: alarm.sound,
            vibrate: alarm.vibrate,
            snoozeEnabled: alarm.snoozeEnabled,
            snoozeDuration: alarm.snoozeDuration,
            // Typing challenge is always enabled
          }),
        },
        android: {
          channelId,
          importance: AndroidImportance.HIGH,
          sound: 'alarm_long', // Longer looped version for better alarm notification
          pressAction: {
            id: 'default',
            launchActivity: 'default',
          },
          fullScreenAction: {
            id: 'alarm_full_screen',
            launchActivity: 'default',
          },
        },
        ios: {
          sound: 'alarm_long.caf', // 24-second looped version for longer notification alert
          critical: true,
          criticalVolume: 1.0,
          interruptionLevel: 'critical',
        },
      },
      trigger,
    );
  }

  static async cancelAlarm(alarmId: string): Promise<void> {
    try {
      await notifee.cancelNotification(alarmId);
    } catch (error) {
      console.error('Error canceling alarm:', error);
    }
  }

  static async cancelAllAlarms(): Promise<void> {
    try {
      await notifee.cancelAllNotifications();
    } catch (error) {
      console.error('Error canceling all alarms:', error);
    }
  }

  private static getNextRepeatTime(
    alarmTime: Date,
    repeatDays: DayOfWeek[],
  ): Date {
    const now = new Date();
    const currentDay = now.getDay();

    // Sort repeat days
    const sortedDays = [...repeatDays].sort((a, b) => a - b);

    // Find the next occurrence
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(now);
      checkDate.setDate(now.getDate() + i);
      const checkDay = checkDate.getDay();

      if (sortedDays.includes(checkDay)) {
        const nextTime = new Date(
          checkDate.getFullYear(),
          checkDate.getMonth(),
          checkDate.getDate(),
          alarmTime.getHours(),
          alarmTime.getMinutes(),
          0,
          0,
        );

        if (nextTime > now) {
          return nextTime;
        }
      }
    }

    // Fallback to tomorrow at the alarm time
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(alarmTime.getHours());
    tomorrow.setMinutes(alarmTime.getMinutes());
    tomorrow.setSeconds(0);
    tomorrow.setMilliseconds(0);
    return tomorrow;
  }

  static async requestPermissions(): Promise<boolean> {
    try {
      const settings = await notifee.requestPermission({
        criticalAlert: true,
        alert: true,
        badge: true,
        sound: true,
      });
      return settings.authorizationStatus >= 1; // Authorized or provisional
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  }
}
