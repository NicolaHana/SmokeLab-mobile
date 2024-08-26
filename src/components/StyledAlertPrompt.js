import React, { useEffect, useRef, useState } from 'react'
import { View, TouchableOpacity, Modal, Text, Keyboard, ScrollView } from 'react-native';
import Constants from '../common/Constants';
import THEME from '../common/Theme';
import StyledTextInput from './StyledTextInput';
import { useThemeContext } from '../contexts/ThemeContext';

const StyledAlertPrompt = ({ visible, insets, title, content = null, done, cancel, onCancelPress, onDonePress }) => {
    if (!visible) {
        return null
    }
    const { theme } = useThemeContext()
    const [password, setPassword] = useState('')
    const passwordTextInputRef = useRef()
    useEffect(() => {
        passwordTextInputRef.current.focus()
        return () => { };
    }, []);
    return (
        <Modal transparent style={{ flex: 1 }} animationType={'fade'} >
            <ScrollView scrollEnabled={false} style={{ flex: 1 }} contentContainerStyle={{ flex: 1, backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.OVERLAY : THEME.DARK_COLOR.OVERLAY, justifyContent: 'flex-start', paddingTop: insets.top }} >
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
                        <StyledTextInput
                            ref={passwordTextInputRef}
                            containerStyle={{ marginTop: 15, alignSelf: 'center' }}
                            placeholder={""}
                            secureTextEntry={true}
                            returnKeyType={"done"}
                            onChangeValue={(value) => {
                                setPassword(value)
                            }}
                            onSubmitEditing={() => {
                                Keyboard.dismiss()
                            }}
                            icon={require('../../assets/images/icon_password.png')}
                            label={""} />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TouchableOpacity onPress={() => password !== '' && onDonePress(password)} style={{ width: (Constants.LAYOUT.SCREEN_WIDTH - 30) / 2, height: 56, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.BACKGROUND_100 : THEME.DARK_COLOR.BACKGROUND_100, borderRadius: 15, marginTop: 5 }}>
                            <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT16, color: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_100 : THEME.DARK_COLOR.TEXT_100 }}>
                                {done}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onCancelPress} style={{ width: (Constants.LAYOUT.SCREEN_WIDTH - 30) / 2, height: 56, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.BACKGROUND_100 : THEME.DARK_COLOR.BACKGROUND_100, borderRadius: 15, marginTop: 5 }}>
                            <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT16, color: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_200 : THEME.DARK_COLOR.TEXT_200 }}>
                                {cancel}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView >
        </Modal>
    )
}

export default StyledAlertPrompt;