import React, {useEffect, useRef} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './types';
import notifee, {EventType} from '@notifee/react-native';
import {SerializableAlarm} from '../types';

// Screens
import AlarmListScreen from '../screens/AlarmListScreen';
import EditAlarmScreen from '../screens/EditAlarmScreen';
import AlarmRingingScreen from '../screens/AlarmRingingScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const navigationRef = useRef<any>(null);

  useEffect(() => {
    // Handle foreground notification events
    const unsubscribe = notifee.onForegroundEvent(({type, detail}) => {
      if (type === EventType.DELIVERED || type === EventType.PRESS) {
        const alarmDataStr = detail.notification?.data?.alarmData;
        if (alarmDataStr && typeof alarmDataStr === 'string') {
          try {
            const alarmData: SerializableAlarm = JSON.parse(alarmDataStr);
            // Navigate to AlarmRinging screen
            if (navigationRef.current) {
              navigationRef.current.navigate('AlarmRinging', {alarm: alarmData});
            }
          } catch (error) {
            console.error('Error parsing alarm data:', error);
          }
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Handle initial notification (app launched from notification)
  useEffect(() => {
    const checkInitialNotification = async () => {
      const initialNotification = await notifee.getInitialNotification();
      if (initialNotification) {
        const alarmDataStr = initialNotification.notification?.data?.alarmData;
        if (alarmDataStr && typeof alarmDataStr === 'string') {
          try {
            const alarmData: SerializableAlarm = JSON.parse(alarmDataStr);
            if (navigationRef.current) {
              navigationRef.current.navigate('AlarmRinging', {alarm: alarmData});
            }
          } catch (error) {
            console.error('Error parsing initial alarm data:', error);
          }
        }
      }
    };

    checkInitialNotification();
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="AlarmList"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1a1a2e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
        <Stack.Screen
          name="AlarmList"
          component={AlarmListScreen}
          options={{title: 'Alarms'}}
        />
        <Stack.Screen
          name="EditAlarm"
          component={EditAlarmScreen}
          options={{title: 'Edit Alarm'}}
        />
        <Stack.Screen
          name="AlarmRinging"
          component={AlarmRingingScreen}
          options={{
            title: 'Alarm',
            headerShown: false,
            presentation: 'fullScreenModal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
