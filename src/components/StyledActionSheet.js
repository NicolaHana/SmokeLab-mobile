import React, { } from 'react'
import { View, TouchableOpacity, Modal, Text } from 'react-native';
import Constants from '../common/Constants';
import THEME from '../common/Theme';
import { useThemeContext } from '../contexts/ThemeContext';

const StyledActionSheet = ({ visible, title, cancel, content = null, options, insets, onCancelPress, onOptionPress }) => {
    if (!visible) {
        return null
    }
    const { theme } = useThemeContext()
    return (
        <Modal transparent style={{ flex: 1 }} animationType={'fade'} >
            <View style={{ flex: 1, backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.OVERLAY : THEME.DARK_COLOR.OVERLAY, justifyContent: 'flex-end' }} >
                <View style={{ backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.TRANSPARENT : THEME.DARK_COLOR.TRANSPARENT, marginHorizontal: 10, paddingTop: 30, paddingBottom: 25 }}>
                    <View style={{ backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.BACKGROUND_100 : THEME.DARK_COLOR.BACKGROUND_100, borderRadius: 15, }}>
                        {
                            title &&
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 15 }}>
                                <Text style={{ textAlign: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT20, color: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_100 : THEME.DARK_COLOR.TEXT_100 }}>
                                    {title}
                                </Text>
                            </View>
                        }
                        {
                            content &&
                            <Text style={{ alignSelf: 'center', textAlign: 'center', marginHorizontal: 20, marginTop: 5, fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT16, color: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_200 : THEME.DARK_COLOR.TEXT_200 }}>
                                {content}
                            </Text>
                        }
                        <View style={{ marginTop: (title || content) ? 10 : 0 }}>
                            {
                                options.map((option, index) =>
                                    <View key={index.toString()}>
                                        {
                                            (index !== 0 || (title || content)) &&
                                            <View style={{ width: Constants.LAYOUT.SCREEN_WIDTH - 20, height: 1, backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.SEPERATOR : THEME.DARK_COLOR.SEPERATOR }} />
                                        }
                                        <TouchableOpacity
                                            onPress={() => onOptionPress(index)}
                                            style={{
                                                width: Constants.LAYOUT.SCREEN_WIDTH - 20,
                                                height: 56,
                                                borderRadius: 0,
                                                backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.TRANSPARENT : THEME.DARK_COLOR.TRANSPARENT,
                                                marginTop: 0,
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                            <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT16, color: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_100 : THEME.DARK_COLOR.TEXT_100 }}>
                                                {option}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                )
                            }
                        </View>
                    </View>
                    <TouchableOpacity onPress={onCancelPress} style={{ width: Constants.LAYOUT.SCREEN_WIDTH - 20, height: 56, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.BACKGROUND_100 : THEME.DARK_COLOR.BACKGROUND_100, borderRadius: 15, marginTop: 5 }}>
                        <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT16, color: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_100 : THEME.DARK_COLOR.TEXT_100 }}>
                            {cancel}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View >
        </Modal>
    )
}

export default StyledActionSheet;