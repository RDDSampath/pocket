import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Transaction from '../Screens/Transaction';


const Stack = createNativeStackNavigator();

const TransactionNavigation = ({ navigation, route }) => {
  return (
        <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="TransactionScreen">
            <Stack.Screen name="TransactionScreen" component={Transaction} />


        </Stack.Navigator>
  );
};

export default TransactionNavigation;