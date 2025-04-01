import React from "react";
import { TouchableOpacity, Platform } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Entypo from "react-native-vector-icons/Entypo";

import HorseDetail from "../screens/HorseDetail";
import { colors } from "../constants/ColorConstant"

// Create Stack Navigator for Horse Detail (to handle back navigation)
const HorseStack = createStackNavigator();

const HorseStackNavigator = () => (
  <HorseStack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: colors.theme.silver,
        height: Platform.OS === 'ios' ? 100 : 50
          },
        headerTintColor: colors.theme.white,
        headerTitleStyle: {
          fontSize: 20,
      }
    }}
  >
    <HorseStack.Screen
      name="HorseDetail"
      component={HorseDetail}
      options={({ navigation }) => ({
        headerTitle: "Horse Details",
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.navigate("Scan", { screen: "MicrochipScan" })}>
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
      listeners={{
        tabPress: e => {
          e.preventDefault();
        },
      }}
    />
  </HorseStack.Navigator>
);

export default HorseStackNavigator;