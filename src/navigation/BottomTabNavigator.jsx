import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";

import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

// Import Screens
import HorseStackNavigator from "./HorseStackNavigator";
import MapView from "../screens/MapView";
import Settings from "../screens/Settings";
import ScanStackNavigator from "./ScanStackNavigator";

// Create Bottom Tab Navigator
const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => {
          const iconMapping = {
            Scan: { icon: "scan-outline", component: Ionicons },
            Horse: { icon: "horse-head", component: FontAwesome5, isFontAwesome: true },
            Map: { icon: "map-outline", component: Ionicons },
            Settings: { icon: "settings-outline", component: Ionicons },
          };

          const { icon, component: IconComponent, isFontAwesome } = iconMapping[route.name] || {};

          return {
            tabBarIcon: ({ color, size }) =>
              isFontAwesome ? (
                <IconComponent name={icon} size={size} color={color} solid />
              ) : (
                <IconComponent name={icon} size={size} color={color} />
              ),
            tabBarActiveTintColor: "#A07C52",
            tabBarInactiveTintColor: "gray",
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
              navigation.navigate('Scan', { screen: 'MicrochipScan' });
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
        {/* <Tab.Screen name="Map" component={MapView} options={{ headerTitle: "Map View" }} />
        <Tab.Screen name="Settings" component={Settings} options={{ headerTitle: "Settings" }} /> */}
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default BottomTabNavigator;
