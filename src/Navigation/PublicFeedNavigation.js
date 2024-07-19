import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PublicFeed from '../Screens/PublicFeed';


const Stack = createNativeStackNavigator();

const PublicFeedNavigation = ({ navigation, route }) => {
  return (
        <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="PublicFeedScreen">
            <Stack.Screen name="PublicFeedScreen" component={PublicFeed} />


        </Stack.Navigator>
  );
};

export default PublicFeedNavigation;