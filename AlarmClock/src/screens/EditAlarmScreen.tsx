import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import {RootStackParamList} from '../navigation/types';
import {
  Alarm,
  DayOfWeek,
  DAY_LABELS,
  fromSerializableAlarm,
} from '../types';
import {AlarmStorage} from '../services/AlarmStorage';
import {AlarmScheduler} from '../services/AlarmScheduler';
import {generateUniqueId} from '../utils/timeUtils';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteType = RouteProp<RootStackParamList, 'EditAlarm'>;

const EditAlarmScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const existingAlarm = route.params?.alarm
    ? fromSerializableAlarm(route.params.alarm)
    : undefined;

  const [time, setTime] = useState<Date>(
    existingAlarm?.time || new Date(),
  );
  const [label, setLabel] = useState(existingAlarm?.label || '');
  const [repeatDays, setRepeatDays] = useState<DayOfWeek[]>(
    existingAlarm?.repeatDays || [],
  );
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleSave = async () => {
    const alarm: Alarm = {
      id: existingAlarm?.id || generateUniqueId(),
      time,
      enabled: true,
      label,
      repeatDays,
      sound: 'default',
      vibrate: true,
      snoozeEnabled: true,
      snoozeDuration: 5,
      // Typing challenge is always enabled
    };

    await AlarmStorage.saveAlarm(alarm);
    await AlarmScheduler.scheduleAlarm(alarm);
    navigation.goBack();
  };

  const toggleDay = (day: DayOfWeek) => {
    setRepeatDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day],
    );
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  const formatTimeDisplay = (date: Date): string => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    return `${displayHours}:${displayMinutes} ${ampm}`;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Time</Text>
        <TouchableOpacity
          style={styles.timeButton}
          onPress={() => setShowTimePicker(true)}>
          <Text style={styles.timeText}>{formatTimeDisplay(time)}</Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            value={time}
            mode="time"
            is24Hour={false}
            display="spinner"
            onChange={onTimeChange}
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Label</Text>
        <TextInput
          style={styles.input}
          value={label}
          onChangeText={setLabel}
          placeholder="Alarm name"
          placeholderTextColor="#666"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Repeat</Text>
        <View style={styles.daysContainer}>
          {Object.values(DayOfWeek)
            .filter(v => typeof v === 'number')
            .map(day => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayButton,
                  repeatDays.includes(day as DayOfWeek) &&
                    styles.dayButtonActive,
                ]}
                onPress={() => toggleDay(day as DayOfWeek)}>
                <Text
                  style={[
                    styles.dayText,
                    repeatDays.includes(day as DayOfWeek) &&
                      styles.dayTextActive,
                  ]}>
                  {DAY_LABELS[day as DayOfWeek]}
                </Text>
              </TouchableOpacity>
            ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            ⚡ All alarms require typing a random Bible verse to dismiss
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Alarm</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a2e',
  },
  sectionTitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  timeButton: {
    alignItems: 'center',
    padding: 20,
  },
  timeText: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#fff',
  },
  input: {
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#fff',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  dayButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  dayText: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
  },
  dayTextActive: {
    color: '#fff',
  },
  saveButton: {
    margin: 20,
    backgroundColor: '#2196F3',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  infoBox: {
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#2196F3',
  },
  infoText: {
    fontSize: 14,
    color: '#2196F3',
    lineHeight: 20,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  difficultyContainer: {
    marginTop: 16,
  },
  difficultyLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  difficultyButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  difficultyButton: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2a2a3e',
  },
  difficultyButtonActive: {
    backgroundColor: 'rgba(33, 150, 243, 0.2)',
    borderColor: '#2196F3',
  },
  difficultyButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4,
  },
  difficultyButtonTextActive: {
    color: '#2196F3',
  },
  difficultyDescription: {
    fontSize: 10,
    color: '#555',
  },
});

export default EditAlarmScreen;
