import React from "react";
import { Platform, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import ScanInstruction from "../screens/MicrochipScan/ScanInstruction";
import MicrochipScan from "../screens/MicrochipScan/MicrochipScan";
import HorseDetail from "../screens/HorseDetail";
import ScannedHorseHistory from "../screens/ScannedHorseHistory";
import Settings from "../screens/Settings";

import { colors } from "../constants/ColorConstant";

const screenHeaderOptions = {
  headerStyle: {
    backgroundColor: colors.theme.silver,
    height: Platform.OS === 'ios' ? 100 : 50
  },
  headerTintColor: colors.theme.white,
  headerTitleStyle: {
    fontSize: 20,
  },
};

const ScanStack = createStackNavigator();
const HorseStack = createStackNavigator();
const Tab = createBottomTabNavigator();

const ScanStackNavigator = () => (
  <ScanStack.Navigator screenOptions={screenHeaderOptions}>
    <ScanStack.Screen name="ScanInstruction" component={ScanInstruction} options={{ headerTitle: "Scan Instruction" }} />
    <ScanStack.Screen
      name="MicrochipScan"
      component={MicrochipScan}
      options={({ route, navigation }) => ({
        headerTitle: route.params?.fromScanInstruction ? null : "Microchip Scan",
        headerBackTitle: '',
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.reset({ index: 0, routes: [{ name: 'ScanInstruction' }] })}>
            <Entypo name="chevron-left" size={26} color={colors.theme.white} style={{ marginLeft: 15 }} />
          </TouchableOpacity>
        )
      })}
    />
  </ScanStack.Navigator>
);

const HorseStackNavigator = () => (
  <HorseStack.Navigator screenOptions={screenHeaderOptions}>
    <HorseStack.Screen
      name="HorseDetail"
      component={HorseDetail}
      options={({ navigation }) => ({
        headerTitle: "Horse Details",
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.navigate("Scan", { screen: "MicrochipScan" })}>
            <Entypo name="chevron-left" size={26} color={colors.theme.white} style={{ marginLeft: 15 }} />
          </TouchableOpacity>
        )
      })}
    />
  </HorseStack.Navigator>
);

const BottomTabsWithStacks = () => (
  <Tab.Navigator
    screenOptions={({ route }) => {
      const iconMap = {
        Scan: { icon: "scan-outline", component: Ionicons },
        Horse: { icon: "horse-head", component: FontAwesome5, isFontAwesome: true },
        History: { icon: "history", component: FontAwesome5, isFontAwesome: true },
        Settings: { icon: "settings-outline", component: Ionicons },
      };

      const { icon, component: Icon, isFontAwesome } = iconMap[route.name] || {};
      return {
        tabBarIcon: ({ color, size }) =>
          isFontAwesome ? <Icon name={icon} size={size} color={color} solid /> : <Icon name={icon} size={size} color={color} />,
        tabBarActiveTintColor: colors.theme.green,
        tabBarInactiveTintColor: colors.theme.silver,
        headerShown: false,
      };
    }}
  >
    <Tab.Screen
      name="Scan"
      component={ScanStackNavigator}
      listeners={({ navigation }) => ({
        tabPress: (e) => {
          e.preventDefault();
          navigation.navigate('Scan', { screen: 'MicrochipScan', params: { fromScanInstruction: true } });
        },
      })}
    />
    <Tab.Screen
      name="Horse"
      component={HorseStackNavigator}
      listeners={{
        tabPress: (e) => {
          e.preventDefault();
        }
      }}
    />
    <Tab.Screen name="History" component={ScannedHorseHistory} options={{ ...screenHeaderOptions, headerTitle: "History" }} />
    <Tab.Screen name="Settings" component={Settings} options={{ ...screenHeaderOptions, headerTitle: "Settings" }} />
  </Tab.Navigator>
);

export default BottomTabsWithStacks;
