import React, { useEffect } from 'react';
import {
    View,
    Platform,
    StatusBar
} from 'react-native';
import Constants from '../common/Constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StyledHeaderTitle from '../components/StyledHeaderTitle';
import StyledBackButton from '../components/StyledBackButton';
import WebView from 'react-native-webview';
import THEME from '../common/Theme';
import { useThemeContext } from '../contexts/ThemeContext';

function TermsScreen({ navigation }) {
    const { theme } = useThemeContext()
    const insets = useSafeAreaInsets()
    useEffect(() => {
        return () => { };
    }, []);
    const onBackPress = () => {
        navigation.pop()
    }
    const HeaderView = () => {
        return (
            <View style={{ marginTop: insets.top, width: Constants.LAYOUT.SCREEN_WIDTH, height: Constants.LAYOUT.HEADER_HEIGHT, justifyContent: 'center' }}>
                <StyledBackButton
                    containerStyle={{ position: 'absolute', left: 25, top: (Constants.LAYOUT.HEADER_HEIGHT - 24) / 2 }}
                    onPress={onBackPress} />
                <StyledHeaderTitle
                    title={"Terms and Conditions"}
                    containerStyle={{ alignSelf: 'center' }} />
            </View>
        )
    }
    return (
        <View style={{ flex: 1, backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.BACKGROUND_100 : THEME.DARK_COLOR.BACKGROUND_100 }} >
            <StatusBar barStyle={Platform.OS == 'ios' ? (theme === 'dark' ? 'light-content' : 'dark-content') : 'light-content'} backgroundColor={theme === 'light' ? THEME.LIGHT_COLOR.BLACK : THEME.DARK_COLOR.BLACK} />
            <HeaderView />
            <WebView style={{ flex: 1 }} source={{ uri: Constants.TERMS_URL }} />
        </View>
    )
}

export default TermsScreen;