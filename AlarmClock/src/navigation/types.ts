import {NavigatorScreenParams} from '@react-navigation/native';
import {SerializableAlarm} from '../types';

export type RootStackParamList = {
  AlarmList: undefined;
  EditAlarm: {alarm?: SerializableAlarm};
  AlarmRinging: {alarm: SerializableAlarm};
  Settings: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
