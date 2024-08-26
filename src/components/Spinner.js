import React from 'react'
import { View, Text, ActivityIndicator, Dimensions } from 'react-native';
import Constants from '../common/Constants';
import THEME from '../common/Theme';
import { useThemeContext } from '../contexts/ThemeContext';

const Spinner = ({ visible, message }) => {
    if (!visible) { return null }
    const { theme } = useThemeContext()
    return (
        <View style={{ position: 'absolute', width: Dimensions.get('window').width, height: Dimensions.get('window').height }} >
            <View style={{ width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', alignItems: 'center', justifyContent: 'center' }} >
                <ActivityIndicator animating={true} size="large" color={theme === 'light' ? THEME.LIGHT_COLOR.WHITE : THEME.DARK_COLOR.WHITE} />
                <Text style={{ textAlign: 'center', marginTop: 10, color: theme === 'light' ? THEME.LIGHT_COLOR.WHITE : THEME.DARK_COLOR.WHITE, fontSize: Constants.FONT_SIZE.FT14, fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM }} >
                    {message}
                </Text>
            </View>
        </View>
    )
}

export default Spinner;