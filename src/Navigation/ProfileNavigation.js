import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Profile from '../Screens/Profile';


const Stack = createNativeStackNavigator();

const ProfileNavigation = ({ navigation, route }) => {
  return (
        <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="ProfileScreen">
            <Stack.Screen name="ProfileScreen" component={Profile} />
        </Stack.Navigator>
  );
};

export default ProfileNavigation;