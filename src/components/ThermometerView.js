import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import Constants from '../common/Constants';
import THEME from '../common/Theme';
import FastImage from 'react-native-fast-image';
import { useThemeContext } from '../contexts/ThemeContext';

const ThermometerView = ({ containerStyle, label, uri, onPress }) => {
    const { theme } = useThemeContext()
    const [dimensions, setDimensions] = useState(null);
    useEffect(() => {
        Image.getSize(uri, (width, height) => {
            setDimensions({ width, height });
        }, (error) => {
            setDimensions({ width: 1, height: 0.5 });
        });
        return () => { };
    }, []);
    return (
        <View style={[containerStyle, {}]}>
            {
                label &&
                <Text style={[styles.itemLabel, { color: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_INPUT_LABEL : THEME.DARK_COLOR.TEXT_INPUT_LABEL }]}>
                    {label}
                </Text>
            }
            <TouchableOpacity onPress={onPress} style={[styles.itemContent, { width: '100%', borderColor: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_INPUT_BORDER : THEME.DARK_COLOR.TEXT_INPUT_BORDER, height: undefined, paddingHorizontal: 0, paddingVertical: 0, borderRadius: 8, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' }]}>
                <FastImage
                    resizeMode={FastImage.resizeMode.contain}
                    style={{ width: '100%', height: undefined, aspectRatio: dimensions ? dimensions.width / dimensions.height : undefined }}
                    source={{
                        uri: uri,
                        priority: FastImage.priority.high
                    }} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    itemContent: {
        marginTop: 10, borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 10
    },
    itemLabel: {
        fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT14
    },
})

export default ThermometerView;