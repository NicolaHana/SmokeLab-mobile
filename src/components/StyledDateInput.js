import React, { forwardRef, useState } from 'react'
import { View, StyleSheet, Image, TouchableOpacity, Text, Modal, SafeAreaView } from 'react-native';
import Constants from '../common/Constants';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import THEME from '../common/Theme';
import { useThemeContext } from '../contexts/ThemeContext';

const StyledDateInput = forwardRef(({ icon = null, mode = 'date', editable = true, initialValue, placeholder, label = '', containerStyle, textStyle, onChangeValue, onShown, minimumDate = null, maximumDate = null }, ref) => {
    const { theme } = useThemeContext()
    const [visibleDatePicker, setVisibleDatePicker] = useState(false)
    const [date, setDate] = useState(initialValue == '' ? null : moment(initialValue).toDate())
    return (
        <TouchableOpacity
            activeOpacity={editable ? 0.2 : 1}
            style={[styles.container, containerStyle, { backgroundColor: editable ? theme === 'light' ? THEME.LIGHT_COLOR.TEXT_INPUT_BACKGROUND : THEME.DARK_COLOR.TEXT_INPUT_BACKGROUND : theme === 'light' ? THEME.LIGHT_COLOR.TEXT_INPUT_DISABLE_BACKGROUND : THEME.DARK_COLOR.TEXT_INPUT_DISABLE_BACKGROUND, borderColor: visibleDatePicker ? theme === 'light' ? THEME.LIGHT_COLOR.PRIMARY : THEME.DARK_COLOR.PRIMARY : theme === 'light' ? THEME.LIGHT_COLOR.TEXT_INPUT_BORDER : THEME.DARK_COLOR.TEXT_INPUT_BORDER }]}
            onPress={() => {
                if (editable) {
                    setVisibleDatePicker(true)
                    onShown()
                }
            }} >
            <Modal transparent={true} visible={visibleDatePicker}>
                <View style={{ flex: 1, backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.OVERLAY : THEME.DARK_COLOR.OVERLAY }}>
                    <View style={{ backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.BACKGROUND_100 : THEME.DARK_COLOR.BACKGROUND_100, width: Constants.LAYOUT.SCREEN_WIDTH, height: 34, position: 'absolute', bottom: 0 }} />
                    <SafeAreaView style={{ flex: 1, justifyContent: 'flex-end' }}>
                        <View style={{ width: Constants.LAYOUT.SCREEN_WIDTH, height: 48, backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.BACKGROUND_100 : THEME.DARK_COLOR.BACKGROUND_100, flexDirection: 'row', paddingHorizontal: 25, alignItems: 'center', justifyContent: 'flex-end' }}>
                            <TouchableOpacity onPress={() => {
                                const selected = (date ? date : moment().toDate())
                                setDate(selected)
                                onChangeValue(mode === 'date' ? moment(selected).format('YYYY-MM-DD') : moment(selected).format('YYYY-MM-DD HH:mm'))
                                setVisibleDatePicker(false)
                            }}>
                                <Text style={{ color: theme === 'light' ? THEME.LIGHT_COLOR.PRIMARY : THEME.DARK_COLOR.PRIMARY, fontFamily: Constants.FONT_FAMILY.PRIMARY_SEMIBOLD, fontSize: Constants.FONT_SIZE.FT18 }}>SELECT</Text>
                            </TouchableOpacity>
                        </View>
                        <DatePicker
                            date={date ? date : moment().toDate()}
                            onDateChange={(date) => {
                                setDate(date)
                            }}
                            mode={mode}
                            theme={theme}
                            minuteInterval={mode === 'date' ? null : 15}
                            minimumDate={minimumDate}
                            maximumDate={maximumDate}
                            style={{ backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.BACKGROUND_100 : THEME.DARK_COLOR.BACKGROUND_100, width: Constants.LAYOUT.SCREEN_WIDTH, alignItems: 'center', justifyContent: 'center' }}
                        />
                    </SafeAreaView>
                </View>
            </Modal>
            {
                icon &&
                <Image style={{ position: 'absolute', left: 15, width: 20, height: 20, tintColor: visibleDatePicker ? theme === 'light' ? THEME.LIGHT_COLOR.PRIMARY : THEME.DARK_COLOR.PRIMARY : theme === 'light' ? THEME.LIGHT_COLOR.TEXT_INPUT_PLACEHOLDER : THEME.DARK_COLOR.TEXT_INPUT_PLACEHOLDER }} source={icon} />
            }
            <Text
                style={[styles.text, textStyle, {
                    marginLeft: icon ? 30 : 0,
                    color: date ?
                        theme === 'light' ? THEME.LIGHT_COLOR.TEXT_100 :
                            THEME.DARK_COLOR.TEXT_100 :
                        theme === 'light' ?
                            THEME.LIGHT_COLOR.TEXT_INPUT_PLACEHOLDER :
                            THEME.DARK_COLOR.TEXT_INPUT_PLACEHOLDER
                }]} >
                {date ? (moment(date).format(mode === 'date' ? 'MMM D, YYYY' : 'MMM D, YYYY HH:mm')) : placeholder}
            </Text>
            {
                label !== '' &&
                <Text numberOfLines={1} style={{ position: 'absolute', top: -25, left: 0, color: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_INPUT_LABEL : THEME.DARK_COLOR.TEXT_INPUT_LABEL, fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT13 }}>
                    {label}
                </Text>
            }
        </TouchableOpacity>
    )
})

const styles = StyleSheet.create({
    container: {
        width: Constants.LAYOUT.SCREEN_WIDTH - 50, height: 48, borderWidth: 1, borderRadius: 8, paddingLeft: 15, paddingRight: 15, justifyContent: 'center'
    },
    text: {
        width: '100%', fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT14
    }
})

export default StyledDateInput;