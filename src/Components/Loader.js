import React from 'react';
import { View,ActivityIndicator, Text, Image } from 'react-native';
import { images } from '../constants/images';
import colors from '../constants/colors';

const Loader = () => {
  return (
    <View style={{height:'100%',width:'100%',backgroundColor:colors.BLACK_COLOR_90, position:'absolute'}}>
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <View style={{height:100,width:100,backgroundColor:colors.WHITE_COLOR,borderRadius:8,justifyContent:'center',alignItems:'center'}}>
            <Image source={images.loading} style={{height:200 , resizeMode:'contain'}} />
            </View>
        </View>
    </View>
  )
}

export default Loader