import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Dashboard from '../Screens/Dashboard';

const Stack = createNativeStackNavigator();

const DashboardNavigation = ({ navigation, route }) => {
  return (
        <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="DashboardScreen">
            <Stack.Screen name="DasboardScreen" component={Dashboard} />


        </Stack.Navigator>
  );
};

export default DashboardNavigation;