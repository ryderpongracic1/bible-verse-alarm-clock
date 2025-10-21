import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Vibration,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';
import {formatTimeAMPM} from '../utils/timeUtils';
import {AlarmStorage} from '../services/AlarmStorage';
import {AlarmScheduler} from '../services/AlarmScheduler';
import {BibleApiService} from '../services/BibleApiService';
import {TextPassage, fromSerializableAlarm} from '../types';
import TypingChallenge from '../components/TypingChallenge';
import SoundService from '../services/SoundService';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteType = RouteProp<RootStackParamList, 'AlarmRinging'>;

const AlarmRingingScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const alarm = fromSerializableAlarm(route.params.alarm);
  const [isVibrating, setIsVibrating] = useState(true);
  const [passage, setPassage] = useState<TextPassage | null>(null);
  const [isLoadingPassage, setIsLoadingPassage] = useState(false);

  useEffect(() => {
    // Start playing alarm sound
    SoundService.playAlarmSound(alarm.sound);

    // Start vibrating when screen loads
    if (alarm.vibrate) {
      const vibrationPattern = [0, 1000, 500, 1000, 500];
      Vibration.vibrate(vibrationPattern, true);
    }

    return () => {
      // Stop sound and vibration when component unmounts
      SoundService.stopSound();
      Vibration.cancel();
    };
  }, [alarm.vibrate, alarm.sound]);

  // Load passage for typing challenge (always enabled)
  useEffect(() => {
    loadPassage();
  }, []);

  // Prevent back button (Android)
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        // Return true to prevent default back behavior
        return true;
      },
    );

    return () => backHandler.remove();
  }, []);

  const loadPassage = async () => {
    setIsLoadingPassage(true);
    try {
      const fetchedPassage = await BibleApiService.getRandomPassage();
      if (fetchedPassage) {
        setPassage(fetchedPassage);
      } else {
        // Use fallback if API fails
        setPassage(BibleApiService.getFallbackPassage());
      }
    } catch (error) {
      console.error('Error loading passage:', error);
      setPassage(BibleApiService.getFallbackPassage());
    } finally {
      setIsLoadingPassage(false);
    }
  };

  const handleDismiss = async () => {
    SoundService.stopSound();
    Vibration.cancel();

    // If alarm doesn't repeat, disable it
    if (alarm.repeatDays.length === 0) {
      const updatedAlarm = {...alarm, enabled: false};
      await AlarmStorage.saveAlarm(updatedAlarm);
    } else {
      // Reschedule for next occurrence
      await AlarmScheduler.scheduleAlarm(alarm);
    }

    navigation.navigate('AlarmList');
  };

  const handleSnooze = async () => {
    if (!alarm.snoozeEnabled) {
      return;
    }

    SoundService.stopSound();
    Vibration.cancel();

    // Schedule alarm to ring again in snoozeDuration minutes
    const snoozeAlarm = {
      ...alarm,
      time: new Date(Date.now() + alarm.snoozeDuration * 60 * 1000),
      repeatDays: [], // Snooze alarms don't repeat
    };

    await AlarmScheduler.scheduleAlarm(snoozeAlarm);
    navigation.navigate('AlarmList');
  };

  // Always show typing challenge (loading or loaded)
  if (isLoadingPassage) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Loading challenge...</Text>
        </View>
      </View>
    );
  }

  if (passage) {
    return (
      <View style={styles.container}>
        <View style={styles.challengeHeader}>
          <Text style={styles.timeText}>{formatTimeAMPM(alarm.time)}</Text>
          {alarm.label && <Text style={styles.labelText}>{alarm.label}</Text>}
        </View>
        <TypingChallenge passage={passage} onComplete={handleDismiss} />
      </View>
    );
  }

  // Fallback if somehow no passage loaded
  return (
    <View style={styles.container}>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
    justifyContent: 'space-between',
    paddingVertical: 60,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  labelText: {
    fontSize: 24,
    color: '#aaa',
    marginBottom: 40,
  },
  iconContainer: {
    marginTop: 40,
  },
  iconText: {
    fontSize: 120,
  },
  buttonsContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  button: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  snoozeButton: {
    backgroundColor: '#FF9800',
  },
  dismissButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#888',
  },
  challengeHeader: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
});

export default AlarmRingingScreen;
