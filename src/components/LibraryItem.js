import React from 'react'
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import Constants from '../common/Constants';
import moment from 'moment';
import THEME from '../common/Theme';
import FastImage from 'react-native-fast-image';
import { useThemeContext } from '../contexts/ThemeContext';

const LibraryItem = ({ item, insets, containerStyle, onPress, onDeletePress }) => {
    const { theme } = useThemeContext()
    return (
        <View style={[styles.container, { borderColor: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_INPUT_BORDER : THEME.DARK_COLOR.TEXT_INPUT_BORDER }, containerStyle]}>
            <TouchableOpacity onPress={onPress} style={[styles.itemContainer, { width: (Dimensions.get('window').width - (insets.left === 0 ? 55 : (insets.left + insets.right))) * 0.2 }]}>
                <Text style={[styles.content, { color: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_100 : THEME.DARK_COLOR.TEXT_100 }]}>
                    {item.cook_title}
                </Text>
            </TouchableOpacity>
            <View style={[styles.seperator, { backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_INPUT_BORDER : THEME.DARK_COLOR.TEXT_INPUT_BORDER }]} />
            <TouchableOpacity onPress={onPress} style={[styles.itemContainer, { width: (Dimensions.get('window').width - (insets.left === 0 ? 55 : (insets.left + insets.right))) * 0.18 }]}>
                <Text style={[styles.content, { color: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_100 : THEME.DARK_COLOR.TEXT_100 }]}>
                    {item.meat_type}
                </Text>
            </TouchableOpacity>
            <View style={[styles.seperator, { backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_INPUT_BORDER : THEME.DARK_COLOR.TEXT_INPUT_BORDER }]} />
            <TouchableOpacity onPress={onPress} style={[styles.itemContainer, { width: (Dimensions.get('window').width - (insets.left === 0 ? 55 : (insets.left + insets.right))) * 0.18 }]}>
                <Text style={[styles.content, { color: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_100 : THEME.DARK_COLOR.TEXT_100 }]}>
                    {moment(item.cook_date).format("MM/DD/YYYY")}
                </Text>
            </TouchableOpacity>
            <View style={[styles.seperator, { backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_INPUT_BORDER : THEME.DARK_COLOR.TEXT_INPUT_BORDER }]} />
            <TouchableOpacity onPress={onPress} style={[styles.itemContainer, { width: (Dimensions.get('window').width - (insets.left === 0 ? 55 : (insets.left + insets.right))) * 0.16 }]}>
                <Text style={[styles.content, { color: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_100 : THEME.DARK_COLOR.TEXT_100 }]}>
                    {item.meat_ratings ? item.meat_ratings.overal_rating : ''}
                </Text>
            </TouchableOpacity>
            <View style={[styles.seperator, { backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_INPUT_BORDER : THEME.DARK_COLOR.TEXT_INPUT_BORDER }]} />
            <View style={[styles.itemContainer, { width: (Dimensions.get('window').width - (insets.left === 0 ? 55 : (insets.left + insets.right))) * 0.18 }]}>
                <ScrollView horizontal>
                    {
                        (item.meat_photos ? item.meat_photos : []).map((photo, index) =>
                            <FastImage
                                key={index.toString()}
                                resizeMode={FastImage.resizeMode.cover}
                                style={[styles.photo, { marginLeft: index === 0 ? 0 : 5 }]}
                                source={{ uri: photo, priority: FastImage.priority.high }} />
                        )
                    }
                </ScrollView>
            </View>
            <View style={[styles.seperator, { backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_INPUT_BORDER : THEME.DARK_COLOR.TEXT_INPUT_BORDER }]} />
            <TouchableOpacity onPress={onDeletePress} style={[styles.itemContainer, { width: (Dimensions.get('window').width - (insets.left === 0 ? 55 : (insets.left + insets.right))) * 0.1 }]}>
                <Image style={{ width: 20, height: 20, tintColor: theme === 'light' ? THEME.LIGHT_COLOR.DESTRUCTIVE : THEME.DARK_COLOR.DESTRUCTIVE }} source={require('../../assets/images/icon_delete.png')} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, width: '100%'
    },
    seperator: {
        width: 1, height: '100%'
    },
    content: {
        alignSelf: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT14, textAlign: 'center'
    },
    itemContainer: {
        flexDirection: 'row', alignItems: 'center', height: 44, width: (Constants.LAYOUT.SCREEN_WIDTH - 55) * 0.3, justifyContent: 'center', paddingHorizontal: 5
    },
    photo: {
        width: 38, height: 38
    }
})

export default LibraryItem;