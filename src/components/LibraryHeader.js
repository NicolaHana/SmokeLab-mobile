import React from 'react'
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import Constants from '../common/Constants';
import THEME from '../common/Theme';
import { useThemeContext } from '../contexts/ThemeContext';

const LibraryHeader = ({ sort, insets, containerStyle, onTitleSortPress, onMeatSortPress, onDateSortPress, onRatingSortPress, onPhotoSortPress }) => {
    const { theme } = useThemeContext()
    return (
        <View style={[styles.container, containerStyle]}>
            <TouchableOpacity onPress={onTitleSortPress} style={[styles.itemContainer, { backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.PRIMARY : THEME.DARK_COLOR.PRIMARY, width: (Dimensions.get('window').width - (insets.left === 0 ? 55 : (insets.left + insets.right))) * 0.2 }]}>
                <Text style={[styles.title, { color: theme === 'light' ? THEME.LIGHT_COLOR.WHITE : THEME.DARK_COLOR.WHITE }]}>
                    {"Title"}
                </Text>
                {
                    sort.field === 'title' &&
                    <Image style={[styles.sortIcon, { tintColor: theme === 'light' ? THEME.LIGHT_COLOR.WHITE : THEME.DARK_COLOR.WHITE }]} source={sort.order === 'asc' ? require('../../assets/images/icon_sort_down.png') : require('../../assets/images/icon_sort_up.png')} />
                }
            </TouchableOpacity>
            <View style={[styles.seperator, { backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.PRIMARY : THEME.DARK_COLOR.PRIMARY, backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.WHITE : THEME.DARK_COLOR.WHITE }]} />
            <TouchableOpacity onPress={onMeatSortPress} style={[styles.itemContainer, { backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.PRIMARY : THEME.DARK_COLOR.PRIMARY, width: (Dimensions.get('window').width - (insets.left === 0 ? 55 : (insets.left + insets.right))) * 0.18 }]}>
                <Text style={[styles.title, { color: theme === 'light' ? THEME.LIGHT_COLOR.WHITE : THEME.DARK_COLOR.WHITE }]}>
                    {"Meat"}
                </Text>
                {
                    sort.field === 'meat' &&
                    <Image style={[styles.sortIcon, { tintColor: theme === 'light' ? THEME.LIGHT_COLOR.WHITE : THEME.DARK_COLOR.WHITE }]} source={sort.order === 'asc' ? require('../../assets/images/icon_sort_down.png') : require('../../assets/images/icon_sort_up.png')} />
                }
            </TouchableOpacity>
            <View style={[styles.seperator, { backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.PRIMARY : THEME.DARK_COLOR.PRIMARY, backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.WHITE : THEME.DARK_COLOR.WHITE }]} />
            <TouchableOpacity onPress={onDateSortPress} style={[styles.itemContainer, { backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.PRIMARY : THEME.DARK_COLOR.PRIMARY, width: (Dimensions.get('window').width - (insets.left === 0 ? 55 : (insets.left + insets.right))) * 0.18 }]}>
                <Text style={[styles.title, { color: theme === 'light' ? THEME.LIGHT_COLOR.WHITE : THEME.DARK_COLOR.WHITE }]}>
                    {"Date"}
                </Text>
                {
                    sort.field === 'date' &&
                    <Image style={[styles.sortIcon, { tintColor: theme === 'light' ? THEME.LIGHT_COLOR.WHITE : THEME.DARK_COLOR.WHITE }]} source={sort.order === 'asc' ? require('../../assets/images/icon_sort_down.png') : require('../../assets/images/icon_sort_up.png')} />
                }
            </TouchableOpacity>
            <View style={[styles.seperator, { backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.PRIMARY : THEME.DARK_COLOR.PRIMARY, backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.WHITE : THEME.DARK_COLOR.WHITE }]} />
            <TouchableOpacity onPress={onRatingSortPress} style={[styles.itemContainer, { backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.PRIMARY : THEME.DARK_COLOR.PRIMARY, width: (Dimensions.get('window').width - (insets.left === 0 ? 55 : (insets.left + insets.right))) * 0.16 }]}>
                <Text style={[styles.title, { color: theme === 'light' ? THEME.LIGHT_COLOR.WHITE : THEME.DARK_COLOR.WHITE }]}>
                    {"Rating"}
                </Text>
                {
                    sort.field === 'rating' &&
                    <Image style={[styles.sortIcon, { tintColor: theme === 'light' ? THEME.LIGHT_COLOR.WHITE : THEME.DARK_COLOR.WHITE }]} source={sort.order === 'asc' ? require('../../assets/images/icon_sort_down.png') : require('../../assets/images/icon_sort_up.png')} />
                }
            </TouchableOpacity>
            <View style={[styles.seperator, { backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.PRIMARY : THEME.DARK_COLOR.PRIMARY, backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.WHITE : THEME.DARK_COLOR.WHITE }]} />
            <TouchableOpacity onPress={onPhotoSortPress} style={[styles.itemContainer, { backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.PRIMARY : THEME.DARK_COLOR.PRIMARY, width: (Dimensions.get('window').width - (insets.left === 0 ? 55 : (insets.left + insets.right))) * 0.18 }]}>
                <Text style={[styles.title, { color: theme === 'light' ? THEME.LIGHT_COLOR.WHITE : THEME.DARK_COLOR.WHITE }]}>
                    {"Photo"}
                </Text>
                {
                    sort.field === 'photo' &&
                    <Image style={[styles.sortIcon, { tintColor: theme === 'light' ? THEME.LIGHT_COLOR.WHITE : THEME.DARK_COLOR.WHITE }]} source={sort.order === 'asc' ? require('../../assets/images/icon_sort_down.png') : require('../../assets/images/icon_sort_up.png')} />
                }
            </TouchableOpacity>
            <View style={[styles.seperator, { backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.PRIMARY : THEME.DARK_COLOR.PRIMARY, backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.WHITE : THEME.DARK_COLOR.WHITE }]} />
            <View style={[styles.itemContainer, { backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.PRIMARY : THEME.DARK_COLOR.PRIMARY, width: (Dimensions.get('window').width - (insets.left === 0 ? 55 : (insets.left + insets.right))) * 0.1 }]}>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row', alignItems: 'center', borderTopLeftRadius: 0, borderTopRightRadius: 0, overflow: 'hidden', width: '100%'
    },
    itemContainer: {
        flexDirection: 'row', alignItems: 'center', height: 44, width: (Constants.LAYOUT.SCREEN_WIDTH - 55) * 0.3, justifyContent: 'center', paddingHorizontal: 5
    },
    seperator: {
        width: 1, height: '100%'
    },
    title: {
        alignSelf: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_SEMIBOLD, fontSize: Constants.FONT_SIZE.FT14
    },
    sortIcon: {
        width: 13, height: 13, marginLeft: 10
    }
})

export default LibraryHeader;