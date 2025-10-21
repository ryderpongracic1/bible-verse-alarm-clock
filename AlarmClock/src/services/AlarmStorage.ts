import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alarm} from '../types';

const ALARMS_STORAGE_KEY = '@alarms';

export class AlarmStorage {
  static async getAllAlarms(): Promise<Alarm[]> {
    try {
      const alarmsJson = await AsyncStorage.getItem(ALARMS_STORAGE_KEY);
      if (!alarmsJson) {
        return [];
      }
      const alarms = JSON.parse(alarmsJson);
      // Convert time strings back to Date objects
      return alarms.map((alarm: any) => ({
        ...alarm,
        time: new Date(alarm.time),
      }));
    } catch (error) {
      console.error('Error loading alarms:', error);
      return [];
    }
  }

  static async saveAlarm(alarm: Alarm): Promise<void> {
    try {
      const alarms = await this.getAllAlarms();
      const existingIndex = alarms.findIndex(a => a.id === alarm.id);

      if (existingIndex >= 0) {
        alarms[existingIndex] = alarm;
      } else {
        alarms.push(alarm);
      }

      await AsyncStorage.setItem(ALARMS_STORAGE_KEY, JSON.stringify(alarms));
    } catch (error) {
      console.error('Error saving alarm:', error);
      throw error;
    }
  }

  static async deleteAlarm(alarmId: string): Promise<void> {
    try {
      const alarms = await this.getAllAlarms();
      const filteredAlarms = alarms.filter(a => a.id !== alarmId);
      await AsyncStorage.setItem(
        ALARMS_STORAGE_KEY,
        JSON.stringify(filteredAlarms),
      );
    } catch (error) {
      console.error('Error deleting alarm:', error);
      throw error;
    }
  }

  static async updateAlarmEnabled(
    alarmId: string,
    enabled: boolean,
  ): Promise<void> {
    try {
      const alarms = await this.getAllAlarms();
      const alarm = alarms.find(a => a.id === alarmId);
      if (alarm) {
        alarm.enabled = enabled;
        await this.saveAlarm(alarm);
      }
    } catch (error) {
      console.error('Error updating alarm enabled state:', error);
      throw error;
    }
  }
}
