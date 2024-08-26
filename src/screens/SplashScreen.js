import React, { useEffect } from 'react';
import {
    View,
    Platform,
    StatusBar
} from 'react-native';
import Constants from '../common/Constants';
import THEME from '../common/Theme';
import FastImage from 'react-native-fast-image';
import { useThemeContext } from '../contexts/ThemeContext';

function SplashScreen({ navigation }) {
    const { theme } = useThemeContext()
    useEffect(() => {
        return () => { };
    }, []);
    return (
        <View style={{ flex: 1, backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.PRIMARY : THEME.DARK_COLOR.PRIMARY, alignItems: 'center', justifyContent: 'center' }} >
            <StatusBar barStyle={Platform.OS == 'ios' ? (theme === 'dark' ? 'light-content' : 'dark-content') : 'light-content'} />
            <FastImage resizeMode={FastImage.resizeMode.contain} style={{ width: Constants.LAYOUT.SCREEN_WIDTH * 0.3, height: Constants.LAYOUT.SCREEN_WIDTH * 0.3 }} source={require('../../assets/images/img_logo_white.png')} />
        </View>
    )
}

export default SplashScreen;