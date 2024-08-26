import React, { } from 'react'
import { View, TouchableOpacity, Modal, Text } from 'react-native';
import Constants from '../common/Constants';
import THEME from '../common/Theme';
import { useThemeContext } from '../contexts/ThemeContext';

const StyledConfirmModal = ({ visible, insets, title, content = null, confirm, cancel, onCancelPress, onConfirmPress }) => {
    if (!visible) {
        return null
    }
    const { theme } = useThemeContext()
    return (
        <Modal transparent style={{ flex: 1 }} animationType={'fade'} >
            <View style={{ flex: 1, backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.OVERLAY : THEME.DARK_COLOR.OVERLAY, justifyContent: 'center', alignItems: 'center' }} >
                <View style={{ backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.TRANSPARENT : THEME.DARK_COLOR.TRANSPARENT, marginHorizontal: 10, paddingTop: 30, paddingBottom: 25 }}>
                    <View style={{ backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.BACKGROUND_100 : THEME.DARK_COLOR.BACKGROUND_100, borderRadius: 15, paddingBottom: 20 }}>
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
                            <Text style={{ alignSelf: 'center', textAlign: 'center', marginHorizontal: 20, marginTop: 10, fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT16, color: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_100 : THEME.DARK_COLOR.TEXT_100 }}>
                                {content}
                            </Text>
                        }
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TouchableOpacity onPress={onConfirmPress} style={{ width: (Constants.LAYOUT.SCREEN_WIDTH - 30) / 2, height: 56, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.BACKGROUND_100 : THEME.DARK_COLOR.BACKGROUND_100, borderRadius: 15, marginTop: 5 }}>
                            <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT16, color: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_100 : THEME.DARK_COLOR.TEXT_100 }}>
                                {confirm}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onCancelPress} style={{ width: (Constants.LAYOUT.SCREEN_WIDTH - 30) / 2, height: 56, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.BACKGROUND_100 : THEME.DARK_COLOR.BACKGROUND_100, borderRadius: 15, marginTop: 5 }}>
                            <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT16, color: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_200 : THEME.DARK_COLOR.TEXT_200 }}>
                                {cancel}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View >
        </Modal>
    )
}

export default StyledConfirmModal;