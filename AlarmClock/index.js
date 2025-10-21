import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import notifee, {EventType} from '@notifee/react-native';

// Register background handler for iOS
notifee.onBackgroundEvent(async ({type, detail}) => {
  console.log('Background notification event:', type);

  // Handle notification events when app is in background or killed
  if (type === EventType.PRESS || type === EventType.DELIVERED) {
    // Notification was pressed or delivered
    // The app will be opened and AppNavigator will handle navigation
    console.log('Alarm notification received in background');
  }
});

AppRegistry.registerComponent(appName, () => App);
