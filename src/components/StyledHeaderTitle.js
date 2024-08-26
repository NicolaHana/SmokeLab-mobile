import React from 'react'
import { View, Text } from 'react-native';
import Constants from '../common/Constants';
import THEME from '../common/Theme';
import { useThemeContext } from '../contexts/ThemeContext';

const StyledHeaderTitle = ({ title, subtitle, containerStyle }) => {
    const { theme } = useThemeContext()
    return (
        <View style={[{}, containerStyle]}>
            <Text numberOfLines={2} style={{ marginHorizontal: 60, textAlign: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_SEMIBOLD, fontSize: Constants.FONT_SIZE.FT20, color: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_100 : THEME.DARK_COLOR.TEXT_100 }}>
                {title}
            </Text>
            {
                subtitle &&
                <Text style={{ textAlign: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT14, color: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_200 : THEME.DARK_COLOR.TEXT_200, marginTop: 2 }}>
                    {subtitle}
                </Text>
            }
        </View>
    )
}

export default StyledHeaderTitle;