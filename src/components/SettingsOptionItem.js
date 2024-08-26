import React, { } from 'react'
import { View, Text, TouchableOpacity, Image, Switch } from 'react-native';
import Constants from '../common/Constants';
import THEME from '../common/Theme';
import { useThemeContext } from '../contexts/ThemeContext';

const SettingsOptionItem = ({ index, title, icon, mode, onPress, onValueChange, border, destructive, containerStyle }) => {
    const { theme } = useThemeContext()
    return (
        <View style={[containerStyle]}>
            <TouchableOpacity activeOpacity={mode === 'Switch' ? 1 : 0.2} onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 25, height: 56 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image style={{ width: 20, height: 20, tintColor: destructive ? theme === 'light' ? THEME.LIGHT_COLOR.DESTRUCTIVE : THEME.DARK_COLOR.DESTRUCTIVE : theme === 'light' ? THEME.LIGHT_COLOR.TEXT_200 : THEME.DARK_COLOR.TEXT_200 }} source={icon} />
                    <Text style={{ marginLeft: 10, fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT16, color: destructive ? theme === 'light' ? THEME.LIGHT_COLOR.DESTRUCTIVE : THEME.DARK_COLOR.DESTRUCTIVE : theme === 'light' ? THEME.LIGHT_COLOR.TEXT_100 : THEME.DARK_COLOR.TEXT_100 }}>
                        {title}
                    </Text>
                </View>
                {
                    mode === 'Next' ?
                        <Image style={{ width: 16, height: 16, tintColor: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_200 : THEME.DARK_COLOR.TEXT_200 }} source={require('../../assets/images/icon_next.png')} /> :
                        mode === 'Switch' ?
                            <Switch value={theme === 'dark'} trackColor={{ true: theme === 'light' ? THEME.LIGHT_COLOR.PRIMARY : THEME.DARK_COLOR.PRIMARY }} onValueChange={onValueChange} thumbColor={theme === 'light' ? THEME.LIGHT_COLOR.WHITE : THEME.DARK_COLOR.WHITE} /> :
                            <View />
                }
            </TouchableOpacity>
            {
                border && <View style={{ height: 1, marginHorizontal: 25, backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.SEPERATOR : THEME.DARK_COLOR.SEPERATOR }} />
            }
        </View>
    )
}

export default SettingsOptionItem;