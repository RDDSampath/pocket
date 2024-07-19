import React,{useEffect} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {View, Image, Text, StyleSheet} from 'react-native';
import {
  responsiveHeight as hp,
  responsiveWidth as wp,
  responsiveFontSize as RF,
                      } from 'react-native-responsive-dimensions';
import { fonts } from '../constants';
import { images } from '../constants/images';
//page import
import DashboardNavigation from './DashboardNavigation';
import GoalsNavigation from './GoalsNavigation';
import ProfileNavigation from './ProfileNavigation';
import PublicFeedNavigation from './PublicFeedNavigation';
import TransactionNavigation from './TransactionNavigation';
import colors from '../constants/colors';

const Tab = createBottomTabNavigator();

const BottomTabNavigation = () => {
  
  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
        tabBarStyle: getTabBarVisibility(route),
        headerShown: false,
        tabBarShowLabel: false,
        tabBarInactiveTintColor: 'black',
        tabBarActiveTintColor: 'black',
      })}>
      <Tab.Screen 
      name="DashboardNavigation"
      component={DashboardNavigation} 
      options={{
        tabBarIcon: ({focused}) => (
          <View style={[{alignItems: 'center'}]}>
            <Image
              source={focused ? images.dashboardActive : images.dashboard}
              style={styles.bottomTabIcons}
            />
            <Text style={[focused ? styles.TextActive:styles.Text]}>Dashboard</Text>
          </View>
        ),
      }}
      />
      <Tab.Screen 
      name="TransactionNavigation"
      component={TransactionNavigation} 
      options={{
        tabBarIcon: ({focused}) => (
          <View style={[{alignItems: 'center'}]}>
            <Image
              source={focused ? images.transactionActive : images.transaction}
              style={styles.bottomTabIcons}
            />
            <Text style={[focused ? styles.TextActive:styles.Text]}>Transaction</Text>
          </View>
        ),
      }}
      />
      <Tab.Screen 
      name="GoalsNavigation"
      component={GoalsNavigation} 
      options={{
        tabBarIcon: ({focused}) => (
          <View style={[{alignItems: 'center'}]}>
            <Image
              source={focused ? images.goalsActive : images.goals}
              style={styles.bottomTabIcons}
            />
            <Text style={[focused ? styles.TextActive:styles.Text]}>Goals</Text>
          </View>
        ),
      }}
      />
      <Tab.Screen 
      name="PublicFeedNavigation"
      component={PublicFeedNavigation} 
      options={{
        tabBarIcon: ({focused}) => (
          <View style={[{alignItems: 'center'}]}>
            <Image
              source={focused ? images.publicFeedActive : images.publicFeed}
              style={styles.bottomTabIcons}
            />
            <Text style={[focused ? styles.TextActive:styles.Text]}>PublicFeed</Text>
          </View>
        ),
      }}
      />
      <Tab.Screen 
      name="ProfileNavigation"
      component={ProfileNavigation} 
      options={{
        tabBarIcon: ({focused}) => (
          <View style={[{alignItems: 'center'}]}>
            <Image
              source={focused ? images.profileActive : images.profile}
              style={styles.bottomTabIcons}
            />
            <Text style={[focused ? styles.TextActive:styles.Text]}>Profile</Text>
          </View>
        ),
      }}
      />
    </Tab.Navigator>
  );
}

const getTabBarVisibility = route => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? '';
    if (
        routeName === '"CreatePdfScreen'||
        routeName === 'ExpensesPdfScreen'
       ) {
       return { display: 'none' };
    }
    return {
      backgroundColor: colors.WHITE_COLOR,
      height: hp(8),
      borderTopLeftRadius: wp(5),
      borderTopRightRadius: wp(5),
      borderTopWidth: 1,
    };
   };
export default BottomTabNavigation;
 
const styles = StyleSheet.create({
  bottomTabIcons: {
    height: wp(7),
    width: wp(7),
    marginTop: hp(1),
  },
  labelStyle:{
    fontSize: RF(1),
     color: 'black',
    },
  dashLine:{
    width: wp(5), 
    height:wp(0.5), 
    marginVertical:wp(1),
    alignSelf: 'center', 
    justifyContent: 'flex-end',
  },
  dashLineActive:{
    backgroundColor: 'black', 
    width: wp(5), 
    height:wp(0.5), 
    marginVertical:wp(1),
    borderRadius: wp(0.5),
    alignSelf: 'center', 
    justifyContent: 'flex-end'
  },
  Text:{
    fontSize: RF(1.2),
    color: 'gray',
    fontFamily:fonts.PoppinsMedium,
    textAlign: 'center',
    fontWeight: '600',
  },
  TextActive:{
    fontSize: RF(1.2),
    color: colors.MAIN_THEME_COLOR,
    fontFamily:fonts.PoppinsBold,
    textAlign: 'center',
    fontWeight: '600',
  },
});