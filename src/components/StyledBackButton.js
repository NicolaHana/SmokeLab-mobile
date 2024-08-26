import React from 'react'
import { Image, TouchableOpacity } from 'react-native';
import THEME from '../common/Theme';
import { useThemeContext } from '../contexts/ThemeContext';

const StyledBackButton = ({ onPress, containerStyle, imageStyle }) => {
    const { theme } = useThemeContext()
    return (
        <TouchableOpacity onPress={onPress} style={[{}, containerStyle]}>
            <Image style={[{ width: 24, height: 24, tintColor: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_200 : THEME.DARK_COLOR.TEXT_200 }, imageStyle]} source={require('../../assets/images/icon_back1.png')} />
        </TouchableOpacity>
    )
}

export default StyledBackButton;