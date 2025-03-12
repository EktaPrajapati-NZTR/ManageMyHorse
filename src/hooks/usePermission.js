import {useState, useEffect, useCallback } from 'react';
import {Alert, Linking} from 'react-native';
import {request, check, RESULTS} from 'react-native-permissions';

import { useNetwork } from "./useNetwork";

const usePermission = permissionType => {
  const [permissionStatus, setPermissionStatus] = useState(null);
  const { appState } = useNetwork();

  //checking permission status
  useEffect(() => {
      checkPermissionStatus();
  }, [checkPermissionStatus, appState]);

  //handling block status
  useEffect(() => {
    if (permissionStatus === RESULTS.BLOCKED) {
      handleBlockedPermission();
    }
  }, [permissionStatus]);

  const checkPermissionStatus = useCallback(async () => {
    try {
      const status = await check(permissionType);
      setPermissionStatus(status);
    } catch (error) {
      console.error('Error checking permission:', error);
    }
  }, [permissionType, permissionStatus]);

  //Check and request permission
  const checkAndRequestPermission = async () => {
    try {
      if (permissionStatus === RESULTS.GRANTED || permissionStatus === RESULTS.BLOCKED) {
        return permissionStatus;
      }
      const status = await request(permissionType);
      setPermissionStatus(status);
      return status;
    } catch (error) {
      console.error('Error requesting permission:', error);
    }
  };

  const handleBlockedPermission = () => {
    Alert.alert(
      'Permission Blocked',
      'You have blocked this permission. Please go to settings and enable it to use this feature.',
      [
        {
          text: 'Cancel',
          onPress: () => {
            // setPermissionStatus(null);
          },
        },
        {
          text: 'Go to settings',
          onPress: () => {
            Linking.openSettings();
          },
        },
      ],
      {cancelable: false},
    );
  };

  return {permissionStatus, checkPermissionStatus, checkAndRequestPermission, handleBlockedPermission};
};

export default usePermission;