import React from 'react'
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from './src/Screens/Auth/SplashScreen';
import { AuthNavigation, BottomTabNavigation} from './src/Navigation';


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        {/* SplashScreen which will come once for 5 Seconds */}
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          // Hiding header for Splash Screen
          options={{headerShown: false}}
        />
        {/* Navigation Drawer as a landing page */}
        <Stack.Screen
          name="BottomTabNavigation"
          component={BottomTabNavigation}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
      
    </NavigationContainer>
  )
}
export default App;