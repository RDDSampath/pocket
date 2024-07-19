import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Goals from '../Screens/Goals';


const Stack = createNativeStackNavigator();

const GoalsNavigation = ({ navigation, route }) => {
  return (
        <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="GoalsScreen">
            <Stack.Screen name="GoalsScreen" component={Goals} />


        </Stack.Navigator>
  );
};

export default GoalsNavigation;