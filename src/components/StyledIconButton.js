import React, { } from 'react'
import { StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import Constants from '../common/Constants';
import LinearGradient from 'react-native-linear-gradient';
import THEME from '../common/Theme';
import { useThemeContext } from '../contexts/ThemeContext';

const StyledIconButton = ({ icon, text, containerStyle, onPress }) => {
    const { theme } = useThemeContext()
    return (
        <LinearGradient colors={[theme === 'light' ? THEME.LIGHT_COLOR.GRAIDENT_LIGHT : THEME.DARK_COLOR.GRAIDENT_LIGHT, theme === 'light' ? THEME.LIGHT_COLOR.GRAIDENT_DARK : THEME.DARK_COLOR.GRAIDENT_DARK]} style={[styles.container, containerStyle]}>
            <TouchableOpacity style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', paddingHorizontal: text ? 0 : 20 }} onPress={onPress}>
                <Image style={{ width: 24, height: 24, resizeMode: 'contain', tintColor: theme === 'light' ? THEME.LIGHT_COLOR.WHITE : THEME.DARK_COLOR.WHITE }} source={icon} />
                {
                    text &&
                    <Text style={{ marginTop: 2, fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT14, color: theme === 'light' ? THEME.LIGHT_COLOR.WHITE : THEME.DARK_COLOR.WHITE }}>
                        {text}
                    </Text>
                }
            </TouchableOpacity>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 40, height: 40, borderRadius: 12, flexDirection: 'row'
    },
})

export default StyledIconButton;