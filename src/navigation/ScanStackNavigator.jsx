import React from "react";
import { Platform } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import ScanInstruction from "../screens/MicrochipScan/ScanInstruction";
import MicrochipScan from "../screens/MicrochipScan/MicrochipScan";

const Stack = createStackNavigator();

const ScanStackNavigator = () => {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerStyle: { backgroundColor: '#A07C52',
          height: Platform.OS === 'ios' ? 100 : 50
            },
          headerTintColor: 'white',
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

      {/* Second screen - Microchip Scan (Back arrow will appear automatically) */}
      <Stack.Screen 
        name="MicrochipScan" 
        component={MicrochipScan} 
        options={{ headerTitle: "Microchip Scan" }} 
      />

    </Stack.Navigator>
  );
};

export default ScanStackNavigator;
