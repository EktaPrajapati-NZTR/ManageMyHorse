import {Platform} from 'react-native';
import {PERMISSIONS} from 'react-native-permissions';

export const permission = {
  location:
    Platform.OS === 'ios' ? PERMISSIONS.IOS.LOCATION_ALWAYS : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
};