import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { View, StyleSheet, Image, Text, TextInput, TouchableOpacity, Platform } from 'react-native';
import Constants from '../common/Constants';
import THEME from '../common/Theme';
import { useThemeContext } from '../contexts/ThemeContext';

const StyledTextInput = forwardRef(({ icon = null, rightIcon = null, placeholder, label = '', editable = true, initialValue, secureTextEntry = false, multiline = false, autoCapitalize = 'none', autoCorrect = false, keyboardType = 'default', returnKeyType = 'default', containerStyle, textStyle, onFocus, onRightIconPress, onChangeValue, onSubmitEditing }, ref) => {
    const { theme } = useThemeContext()
    const [value, setValue] = useState(initialValue)
    const [focused, setFocused] = useState(false)
    const [visiblePassword, setVisiblePassword] = useState(false)
    const textInputRef = useRef()
    useEffect(() => {
        if (value !== initialValue) {
            setValue(initialValue)
        }
        return () => { };
    }, [initialValue]);
    const onEyePress = () => {
        setVisiblePassword(!visiblePassword)
    }
    useImperativeHandle(ref, () => ({
        focus,
    }))
    const focus = () => {
        textInputRef.current.focus()
    }
    return (
        <View style={[styles.container, containerStyle, { borderColor: focused ? theme === 'light' ? THEME.LIGHT_COLOR.PRIMARY : THEME.DARK_COLOR.PRIMARY : theme === 'light' ? THEME.LIGHT_COLOR.TEXT_INPUT_BORDER : THEME.DARK_COLOR.TEXT_INPUT_BORDER, backgroundColor: editable ? theme === 'light' ? THEME.LIGHT_COLOR.TEXT_INPUT_BACKGROUND : THEME.DARK_COLOR.TEXT_INPUT_BACKGROUND : theme === 'light' ? THEME.LIGHT_COLOR.TEXT_INPUT_DISABLE_BACKGROUND : THEME.DARK_COLOR.TEXT_INPUT_DISABLE_BACKGROUND }]} >
            {
                icon &&
                <Image style={{ position: 'absolute', left: 15, top: multiline ? 13 : undefined, width: 20, height: 20, tintColor: focused ? theme === 'light' ? THEME.LIGHT_COLOR.PRIMARY : THEME.DARK_COLOR.PRIMARY : theme === 'light' ? THEME.LIGHT_COLOR.TEXT_INPUT_PLACEHOLDER : THEME.DARK_COLOR.TEXT_INPUT_PLACEHOLDER }} source={icon} />
            }
            <TextInput
                ref={textInputRef}
                value={value}
                editable={editable}
                multiline={multiline}
                placeholder={placeholder}
                onChangeText={(text) => {
                    setValue(text)
                    onChangeValue(text)
                }}
                onSubmitEditing={onSubmitEditing}
                autoCorrect={autoCorrect}
                autoCapitalize={autoCapitalize}
                keyboardType={keyboardType}
                returnKeyType={returnKeyType}
                secureTextEntry={secureTextEntry ? !visiblePassword : false}
                onFocus={() => {
                    setFocused(true)
                    onFocus && onFocus()
                }}
                onBlur={() => setFocused(false)}
                style={[styles.text, textStyle, { color: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_INPUT_TEXT : THEME.DARK_COLOR.TEXT_INPUT_TEXT, flex: multiline ? undefined : 1, paddingLeft: 0, paddingTop: multiline ? Platform.OS === 'ios' ? 15 : 12 : 0, paddingBottom: multiline ? 15 : 0, marginLeft: icon ? 30 : 0, marginRight: rightIcon ? 30 : undefined, height: multiline ? '100%' : undefined, minHeight: multiline ? undefined : 48, textAlignVertical: multiline ? 'top' : 'center' }]}
                selectionColor={theme === 'light' ? THEME.LIGHT_COLOR.TEXT_INPUT_SELECTION_COLOR : THEME.DARK_COLOR.TEXT_INPUT_SELECTION_COLOR}
                placeholderTextColor={theme === 'light' ? THEME.LIGHT_COLOR.TEXT_INPUT_PLACEHOLDER : THEME.DARK_COLOR.TEXT_INPUT_PLACEHOLDER} />
            {
                secureTextEntry &&
                <TouchableOpacity onPress={onEyePress} style={{ position: 'absolute', right: 15 }}>
                    <Image style={{ width: 20, height: 20, tintColor: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_INPUT_PLACEHOLDER : THEME.DARK_COLOR.TEXT_INPUT_PLACEHOLDER }} source={visiblePassword ? require('../../assets/images/icon_visible.png') : require('../../assets/images/icon_invisible.png')} />
                </TouchableOpacity>
            }
            {
                rightIcon &&
                <TouchableOpacity onPress={onRightIconPress} style={{ position: 'absolute', right: 15 }}>
                    <Image style={{ width: 20, height: 20, tintColor: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_INPUT_PLACEHOLDER : THEME.DARK_COLOR.TEXT_INPUT_PLACEHOLDER }} source={rightIcon} />
                </TouchableOpacity>
            }
            {
                label !== '' &&
                <Text numberOfLines={1} style={{ position: 'absolute', top: -25, left: 0, color: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_INPUT_LABEL : THEME.DARK_COLOR.TEXT_INPUT_LABEL, fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT13 }}>
                    {label}
                </Text>
            }
        </View>
    )
})

const styles = StyleSheet.create({
    container: {
        width: Constants.LAYOUT.SCREEN_WIDTH - 50, height: 48, borderWidth: 1, borderRadius: 8, paddingLeft: 15, paddingRight: 15, justifyContent: 'center'
    },
    text: {
        fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT14
    }
})

export default StyledTextInput;