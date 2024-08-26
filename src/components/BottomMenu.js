import React from 'react'
import { View } from 'react-native';
import StyledIconButton from './StyledIconButton';
import THEME from '../common/Theme';
import { useThemeContext } from '../contexts/ThemeContext';
import Constants from '../common/Constants';

const BottomMenu = ({ containerStyle, onHomePress, onSavePress, onLibraryPress, onProfilePress }) => {
    const { theme } = useThemeContext()
    return (
        <View style={[{
            paddingTop: 15,
            backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.BACKGROUND_100 : THEME.DARK_COLOR.BACKGROUND_100,
            shadowColor: theme === 'light' ? THEME.LIGHT_COLOR.SHADOW : THEME.DARK_COLOR.SHADOW,
            shadowOffset: {
                width: 0,
                height: -5,
            },
            shadowOpacity: 0.08,
            shadowRadius: 4.59,
            elevation: 5,
            width: Constants.LAYOUT.SCREEN_WIDTH,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 25,
            justifyContent: 'space-between'
        }, containerStyle]}>
            <StyledIconButton
                containerStyle={{ width: 76, height: 56 }}
                text={"Home"}
                icon={require('../../assets/images/icon_home.png')}
                onPress={onHomePress} />
            <StyledIconButton
                containerStyle={{ width: 76, height: 56 }}
                text={"Save"}
                icon={require('../../assets/images/icon_save.png')}
                onPress={onSavePress} />
            <StyledIconButton
                containerStyle={{ width: 76, height: 56 }}
                text={"Library"}
                icon={require('../../assets/images/icon_library.png')}
                onPress={onLibraryPress} />
            <StyledIconButton
                containerStyle={{ width: 76, height: 56 }}
                text={"Settings"}
                icon={require('../../assets/images/icon_settings.png')}
                onPress={onProfilePress} />
        </View>
    )
}

export default BottomMenu;