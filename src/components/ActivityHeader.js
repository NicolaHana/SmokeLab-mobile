import React from 'react'
import { View, Text, StyleSheet } from 'react-native';
import Constants from '../common/Constants';
import THEME from '../common/Theme';
import { useThemeContext } from '../contexts/ThemeContext';

const ActivityHeader = ({ containerStyle, editable = false, deletable = false }) => {
    const { theme } = useThemeContext()
    return (
        <View style={[styles.container, containerStyle]}>
            <View style={[styles.seperator, { backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.PRIMARY : THEME.DARK_COLOR.PRIMARY }]} />
            <View style={[styles.itemContainer, { backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.PRIMARY : THEME.DARK_COLOR.PRIMARY, width: (Constants.LAYOUT.SCREEN_WIDTH - (deletable ? 54 : 53)) * (deletable ? 0.5 : 0.5) }]}>
                <Text style={[styles.title, { color: theme === 'light' ? THEME.LIGHT_COLOR.WHITE : THEME.DARK_COLOR.WHITE }]}>
                    {"Activity"}
                </Text>
            </View>
            <View style={[styles.seperator, { backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.WHITE : THEME.DARK_COLOR.WHITE }]} />
            <View style={[styles.itemContainer, { backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.PRIMARY : THEME.DARK_COLOR.PRIMARY, width: (Constants.LAYOUT.SCREEN_WIDTH - (deletable ? 54 : 53)) * (deletable ? 0.35 : 0.5) }]}>
                <Text style={[styles.title, { color: theme === 'light' ? THEME.LIGHT_COLOR.WHITE : THEME.DARK_COLOR.WHITE }]}>
                    {"Time"}
                </Text>
            </View>
            <View style={[styles.seperator, { backgroundColor: deletable ? theme === 'light' ? THEME.LIGHT_COLOR.WHITE : THEME.DARK_COLOR.WHITE : theme === 'light' ? THEME.LIGHT_COLOR.PRIMARY : THEME.DARK_COLOR.PRIMARY }]} />
            {
                deletable &&
                <View style={[styles.itemContainer, { backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.PRIMARY : THEME.DARK_COLOR.PRIMARY, width: (Constants.LAYOUT.SCREEN_WIDTH - 54) * 0.15 }]} />
            }
            {
                deletable &&
                <View style={[styles.seperator, { backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.PRIMARY : THEME.DARK_COLOR.PRIMARY }]} />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row', alignItems: 'center', borderTopLeftRadius: 0, borderTopRightRadius: 0, overflow: 'hidden'
    },
    itemContainer: {
        flexDirection: 'row', alignItems: 'center', height: 44, width: (Constants.LAYOUT.SCREEN_WIDTH - 56) * 0.3, justifyContent: 'center', paddingHorizontal: 5
    },
    seperator: {
        width: 1, height: '100%'
    },
    title: {
        alignSelf: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_SEMIBOLD, fontSize: Constants.FONT_SIZE.FT14
    },
})

export default ActivityHeader;