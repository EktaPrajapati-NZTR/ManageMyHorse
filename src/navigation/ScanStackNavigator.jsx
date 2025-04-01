import React from "react";
import { TouchableOpacity, Platform } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Entypo from "react-native-vector-icons/Entypo";

import ScanInstruction from "../screens/MicrochipScan/ScanInstruction";
import MicrochipScan from "../screens/MicrochipScan/MicrochipScan";
import { colors } from "../constants/ColorConstant"

const Stack = createStackNavigator();

const ScanStackNavigator = () => {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerStyle: { backgroundColor: colors.theme.silver,
          height: Platform.OS === 'ios' ? 100 : 50
            },
          headerTintColor: colors.theme.white,
          headerTitleStyle: {
            fontSize: 20,
        }
      }}>
        
      {/* First screen - Scan Instruction */}
      <Stack.Screen 
        name="ScanInstruction" 
        component={ScanInstruction} 
        options={{ headerTitle: "Scan Instruction" }} 
      />

      {/* Second screen - Microchip Scan */}
      <Stack.Screen 
        name="MicrochipScan" 
        component={MicrochipScan} 
        options={({ route, navigation }) => ({
          headerTitle: route.params?.fromScanInstruction ? null : "Microchip Scan",
          headerBackTitle: '', // Hide the back button label,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.reset({
              index: 0,  // Resets the navigation stack to just the 'ScanInstruction' screen
              routes: [{ name: 'ScanInstruction' }]  // Navigates to 'ScanInstruction'
            })}>
              <Entypo 
                  name="chevron-left" 
                  size={26} 
                  color={colors.theme.white}
                  style={{ 
                      marginLeft: 15,
                      marginRight: 15
                  }} />
            </TouchableOpacity>
          ),
        })}
      />

    </Stack.Navigator>
  );
};

export default ScanStackNavigator;
