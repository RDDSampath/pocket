import React, {useState, useEffect} from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { 
  responsiveScreenHeight as SH,
  responsiveScreenWidth as SW,
  responsiveScreenFontSize as RF,
} from 'react-native-responsive-dimensions';
import { images } from '../../constants/images';
import { fonts } from '../../constants';
import colors from '../../constants/colors';

const SplashScreen = ({navigation}) => {
  // State for ActivityIndicator animation
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    setTimeout(async () => {
      setAnimating(false);
        // Navigate to AuthNavigation
        navigation.navigate('BottomTabNavigation');
    }, 3000);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={images.logog} style={{height: 200 ,width:200}} resizeMode='contain' />
      <Image source={images.loading} style={styles.loading} resizeMode='contain' />
      <Text style={styles.logoText}>P O C K E T</Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: colors.WHITE_COLOR,
    paddingTop: SH(15),
  },
  logoText: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: RF(5),
   top: SH(50),
   color: colors.MAIN_THEME_COLOR,
    position: 'absolute',
  },
  logoTextsub: {
    fontFamily: fonts.PoppinsRegular,
    fontSize: RF(3),
   top: SH(50),
   color: colors.MAIN_THEME_COLOR,
    position: 'absolute',
  },
  loading: {
    height: 200,
    width: 200,
    top: SH(60),
    position: 'absolute',
  },
});
