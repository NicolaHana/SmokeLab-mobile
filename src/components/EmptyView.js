import React, { } from 'react'
import { View, StyleSheet, Text } from 'react-native';
import Constants from '../common/Constants';
import StyledButton from './StyledButton';
import THEME from '../common/Theme';
import { useThemeContext } from '../contexts/ThemeContext';

const EmptyView = ({ message, textStyle, onRefresh = undefined }) => {
    const { theme } = useThemeContext()
    return (
        <View style={styles.container}>
            <Text style={[styles.text, { color: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_200 : THEME.DARK_COLOR.TEXT_200 }, textStyle]}>
                {message}
            </Text>
            {
                onRefresh &&
                <StyledButton
                    title={"Refresh"}
                    containerStyle={{ marginTop: 20, width: 110, height: 36, borderRadius: 18, backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.PRIMARY : THEME.DARK_COLOR.PRIMARY }}
                    textStyle={{ color: theme === 'light' ? THEME.LIGHT_COLOR.WHITE : THEME.DARK_COLOR.WHITE, fontSize: Constants.FONT_SIZE.FT16, fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR }}
                    onPress={onRefresh} />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center', paddingTop: 50
    },
    text: {
        fontSize: Constants.FONT_SIZE.FT16, fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR
    }
})

export default EmptyView;