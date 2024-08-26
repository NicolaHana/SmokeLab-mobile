import React, { } from 'react'
import { StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import Constants from '../common/Constants';
import LinearGradient from 'react-native-linear-gradient';
import THEME from '../common/Theme';
import { useThemeContext } from '../contexts/ThemeContext';

const StyledButton = ({ title, icon = null, containerStyle, textStyle, iconStyle, onPress }) => {
    const { theme } = useThemeContext()
    return (
        <LinearGradient colors={[theme === 'light' ? THEME.LIGHT_COLOR.GRAIDENT_LIGHT : THEME.DARK_COLOR.GRAIDENT_LIGHT, theme === 'light' ? THEME.LIGHT_COLOR.GRAIDENT_DARK : THEME.DARK_COLOR.GRAIDENT_DARK]} style={[styles.container, containerStyle]}>
            <TouchableOpacity style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, flexDirection: 'row' }} onPress={onPress}>
                {
                    icon &&
                    <Image style={[{ width: 24, height: 24, marginRight: 10, resizeMode: 'contain' }, iconStyle]} source={icon} />
                }
                <Text style={[styles.text, { color: theme === 'light' ? THEME.LIGHT_COLOR.WHITE : THEME.DARK_COLOR.WHITE }, textStyle]}>
                    {title}
                </Text>
            </TouchableOpacity>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        width: Constants.LAYOUT.SCREEN_WIDTH - 60, height: 58, borderRadius: 8, flexDirection: 'row'
    },
    text: {
        fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT18, textAlign: 'center'
    }
})

export default StyledButton;