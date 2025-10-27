import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';
import {Alarm, DAY_LABELS, toSerializableAlarm} from '../types';
import {AlarmStorage} from '../services/AlarmStorage';
import {AlarmScheduler} from '../services/AlarmScheduler';
import {formatTimeAMPM} from '../utils/timeUtils';
import BackgroundAudioService from '../services/BackgroundAudioService';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AlarmListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [alarms, setAlarms] = useState<Alarm[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadAlarms();
    }, []),
  );

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const granted = await AlarmScheduler.requestPermissions();
    if (!granted) {
      Alert.alert(
        'Permissions Required',
        'Please enable notifications to use alarms.',
      );
    }
  };

  const loadAlarms = async () => {
    const loadedAlarms = await AlarmStorage.getAllAlarms();
    setAlarms(loadedAlarms);
  };

  const handleToggleAlarm = async (alarm: Alarm) => {
    const updatedAlarm = {...alarm, enabled: !alarm.enabled};
    await AlarmStorage.saveAlarm(updatedAlarm);
    await AlarmScheduler.scheduleAlarm(updatedAlarm);

    // Check if there are any remaining active alarms
    // If not, stop background audio to conserve battery
    if (!updatedAlarm.enabled) {
      const hasActiveAlarms = await AlarmScheduler.hasActiveAlarms();
      if (!hasActiveAlarms) {
        try {
          await BackgroundAudioService.stop();
        } catch (error) {
          console.warn('Failed to stop background audio:', error);
        }
      }
    }

    loadAlarms();
  };

  const handleDeleteAlarm = async (alarmId: string) => {
    Alert.alert('Delete Alarm', 'Are you sure you want to delete this alarm?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await AlarmScheduler.cancelAlarm(alarmId);
          await AlarmStorage.deleteAlarm(alarmId);

          // Check if there are any remaining active alarms
          // If not, stop background audio to conserve battery
          const hasActiveAlarms = await AlarmScheduler.hasActiveAlarms();
          if (!hasActiveAlarms) {
            try {
              await BackgroundAudioService.stop();
            } catch (error) {
              console.warn('Failed to stop background audio:', error);
            }
          }

          loadAlarms();
        },
      },
    ]);
  };

  const renderRepeatDays = (alarm: Alarm) => {
    if (alarm.repeatDays.length === 0) {
      return <Text style={styles.repeatText}>Once</Text>;
    }
    if (alarm.repeatDays.length === 7) {
      return <Text style={styles.repeatText}>Every day</Text>;
    }
    const days = alarm.repeatDays
      .sort((a, b) => a - b)
      .map(day => DAY_LABELS[day])
      .join(', ');
    return <Text style={styles.repeatText}>{days}</Text>;
  };

  const renderAlarmItem = ({item}: {item: Alarm}) => (
    <TouchableOpacity
      style={styles.alarmItem}
      onPress={() =>
        navigation.navigate('EditAlarm', {alarm: toSerializableAlarm(item)})
      }
      onLongPress={() => handleDeleteAlarm(item.id)}>
      <View style={styles.alarmContent}>
        <Text style={styles.timeText}>{formatTimeAMPM(item.time)}</Text>
        {item.label && <Text style={styles.labelText}>{item.label}</Text>}
        {renderRepeatDays(item)}
      </View>
      <Switch
        value={item.enabled}
        onValueChange={() => handleToggleAlarm(item)}
        trackColor={{false: '#767577', true: '#81b0ff'}}
        thumbColor={item.enabled ? '#2196F3' : '#f4f3f4'}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={alarms}
        renderItem={renderAlarmItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No alarms set</Text>
            <Text style={styles.emptySubText}>
              Tap the + button to add an alarm
            </Text>
          </View>
        }
      />
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => navigation.navigate('Settings')}>
        <Text style={styles.settingsButtonText}>⚙</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('EditAlarm', {})}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  alarmItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  alarmContent: {
    flex: 1,
  },
  timeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  labelText: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 4,
  },
  repeatText: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  settingsButton: {
    position: 'absolute',
    bottom: 100,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4a4a5e',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  settingsButtonText: {
    fontSize: 28,
    color: '#fff',
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addButtonText: {
    fontSize: 36,
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 20,
    color: '#666',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#444',
  },
});

export default AlarmListScreen;
