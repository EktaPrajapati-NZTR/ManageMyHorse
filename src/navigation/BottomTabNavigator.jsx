import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

// Import Screens
import HorseStackNavigator from "./HorseStackNavigator";
import ScannedHorseHistory from "../screens/ScannedHorseHistory";
import MapView from "../screens/MapView";
import Settings from "../screens/Settings";
import ScanStackNavigator from "./ScanStackNavigator";
import { colors } from "../constants/ColorConstant"

// Create Bottom Tab Navigator
const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
      <Tab.Navigator
        screenOptions={({ route }) => {
          const iconMapping = {
            Scan: { icon: "scan-outline", component: Ionicons },
            Horse: { icon: "horse-head", component: FontAwesome5, isFontAwesome: true },
            History: {icon: "history", component: FontAwesome5, isFontAwesome: true},
            Settings: { icon: "settings-outline", component: Ionicons },
            // Map: { icon: "map-outline", component: Ionicons },
          };

          const { icon, component: IconComponent, isFontAwesome } = iconMapping[route.name] || {};

          return {
            tabBarIcon: ({ color, size }) =>
              isFontAwesome ? (
                <IconComponent name={icon} size={size} color={color} solid />
              ) : (
                <IconComponent name={icon} size={size} color={color} />
              ),
            tabBarActiveTintColor: colors.theme.green,
            tabBarInactiveTintColor: colors.theme.silver,
          };
        }}
      >
        <Tab.Screen name="Scan" component={ScanStackNavigator} 
          options={{ headerShown: false }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              // Prevent default behavior of navigating to the first screen in the stack (ScanInstruction)
              e.preventDefault();
              // Manually navigate to the MicrochipScan screen in the stack
              navigation.navigate('Scan', { screen: 'MicrochipScan', params: { fromScanInstruction: true } });
            },
          })}
        />
        <Tab.Screen name="Horse" component={HorseStackNavigator} 
          options={{
            headerShown: false,
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
            },
          }}
        />
        <Tab.Screen name="History" component={ScannedHorseHistory} 
          options={{
            headerTitle: "History",
            headerStyle: { 
              backgroundColor: colors.theme.silver, 
              height: Platform.OS === 'ios' ? 100 : 50 
            },
            headerTintColor: colors.theme.white,
            headerTitleStyle: {
              fontSize: 20,
            },
          }}
        />
        <Tab.Screen name="Settings" component={Settings} 
          options={{
            headerTitle: "Settings",
            headerStyle: { 
              backgroundColor: colors.theme.silver, 
              height: Platform.OS === 'ios' ? 100 : 50 
            },
            headerTintColor: colors.theme.white,
            headerTitleStyle: {
              fontSize: 20,
            },
          }}
        />
        {/* <Tab.Screen name="Map" component={MapView} options={{ headerTitle: "Map View" }} />*/}
      </Tab.Navigator>
  );
};

export default BottomTabNavigator;
