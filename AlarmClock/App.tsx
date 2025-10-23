import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import {AlarmScheduler} from './src/services/AlarmScheduler';
import BackgroundAudioService from './src/services/BackgroundAudioService';

const App: React.FC = () => {
  useEffect(() => {
    // Initialize background audio on app startup if there are active alarms
    const initializeBackgroundAudio = async () => {
      try {
        const hasActiveAlarms = await AlarmScheduler.hasActiveAlarms();
        if (hasActiveAlarms) {
          await BackgroundAudioService.start();
          console.log('[App] Background audio initialized - active alarms found');
        } else {
          console.log('[App] No active alarms - background audio not started');
        }
      } catch (error) {
        console.warn('[App] Failed to initialize background audio:', error);
      }
    };

    initializeBackgroundAudio();
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f1e" />
      <AppNavigator />
    </>
  );
};

export default App;
