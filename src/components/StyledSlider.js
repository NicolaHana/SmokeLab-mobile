import React, { forwardRef, useState } from 'react'
import { View, StyleSheet, Text } from 'react-native';
import Constants from '../common/Constants';
import Slider from "@react-native-community/slider";
import THEME from '../common/Theme';
import { useThemeContext } from '../contexts/ThemeContext';

const StyledSlider = forwardRef(({ label = '', min, max, initialValue = 0, containerStyle, onChangeValue }, ref) => {
    const { theme } = useThemeContext()
    const [value, setValue] = useState(initialValue)
    return (
        <View style={[styles.container, containerStyle]} >
            {
                label !== '' &&
                <Text style={[styles.label, { color: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_INPUT_LABEL : THEME.DARK_COLOR.TEXT_INPUT_LABEL }]}>
                    {`${label} (${value})`}
                </Text>
            }
            <Slider
                minimumValue={0}
                maximumValue={10}
                step={1}
                value={value}
                minimumTrackTintColor={theme === 'light' ? THEME.LIGHT_COLOR.GRAIDENT_LIGHT : THEME.DARK_COLOR.GRAIDENT_LIGHT}
                maximumTrackTintColor={theme === 'light' ? THEME.LIGHT_COLOR.SEPERATOR : THEME.DARK_COLOR.SEPERATOR}
                thumbTintColor={theme === 'light' ? THEME.LIGHT_COLOR.WHITE : THEME.DARK_COLOR.WHITE}
                onValueChange={(val) => {
                    setValue(val)
                    onChangeValue(val)
                }} />
            <View style={styles.rangeContainer}>
                <Text style={[styles.rangeText, { color: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_100 : THEME.DARK_COLOR.TEXT_100 }]}>
                    {min}
                </Text>
                <Text style={[styles.rangeText, { color: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_100 : THEME.DARK_COLOR.TEXT_100 }]}>
                    {max}
                </Text>
            </View>
        </View>
    )
})

const styles = StyleSheet.create({
    container: {
        width: Constants.LAYOUT.SCREEN_WIDTH - 50
    },
    label: {
        position: 'absolute', top: -25, left: 0, fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT13
    },
    rangeContainer: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10
    },
    rangeText: {
        fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT14
    }
})

export default StyledSlider;