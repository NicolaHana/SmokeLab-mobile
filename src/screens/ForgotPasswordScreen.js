import React, { useEffect, useState } from 'react';
import {
    Image,
    View,
    Platform,
    StatusBar,
    Text,
    ScrollView,
    Keyboard,
    LayoutAnimation
} from 'react-native';
import Constants from '../common/Constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StyledButton from '../components/StyledButton';
import StyledTextInput from '../components/StyledTextInput';
import StyledIconButton from '../components/StyledIconButton';
import Spinner from '../components/Spinner';
import { presentAlertMessage } from '../common/Functions';
import FastImage from 'react-native-fast-image';
import THEME from '../common/Theme';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useThemeContext } from '../contexts/ThemeContext';

function ForgotPasswordScreen({ navigation }) {
    const { theme } = useThemeContext()
    const insets = useSafeAreaInsets()
    const auth = getAuth()
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [keyboardHeight, setKeyboardHeight] = useState(0)
    const IMAGE_HEIGHT = Constants.LAYOUT.SCREEN_WIDTH * 675 / 1080
    const BORDER_RADIUS = 35
    useEffect(() => {
        return () => { };
    }, []);
    useEffect(() => {
        const showSubscription = Keyboard.addListener(Platform.OS == 'ios' ? "keyboardWillShow" : "keyboardDidShow", (event) => keyboardDidShow(event));
        const hideSubscription = Keyboard.addListener(Platform.OS == 'ios' ? "keyboardWillHide" : "keyboardDidHide", (event) => keyboardDidHide(event));
        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        }
    }, []);
    const keyboardDidShow = (event) => {
        let height = event.endCoordinates.height;
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setKeyboardHeight(height)
    }
    const keyboardDidHide = (event) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setKeyboardHeight(0)
    }
    const onBackPress = () => {
        navigation.pop()
    }
    const onRequestPress = () => {
        if (email === '') { return }

        resetPassword()
    }
    const resetPassword = async () => {
        Keyboard.dismiss()

        try {
            setLoading(true)
            await sendPasswordResetEmail(auth, email)

            setLoading(false)
            setTimeout(() => {
                presentAlertMessage({ title: "Your password reset request was sent to the email address associated with this account. Please check your email to reset your password" })
            }, 100);
        } catch (error) {
            console.log('sendPasswordResetEmail:', error)
            setLoading(false)
            if (error.code === "auth/invalid-email") {
                setTimeout(() => {
                    presentAlertMessage({ title: "The email address you've entered is not valid." })
                }, 100);
            } else if (error.code === "auth/user-not-found") {
                setTimeout(() => {
                    presentAlertMessage({ title: "There is no user associated with this email." })
                }, 100);
            } else {
                setTimeout(() => {
                    presentAlertMessage({ title: "Some problems occurred, please try again." })
                }, 100);
            }
        }
    }
    const HeaderView = () => {
        return (
            <View style={{ position: 'absolute', top: 0 }}>
                <View style={{}}>
                    <FastImage resizeMode={FastImage.resizeMode.cover} style={{ width: Constants.LAYOUT.SCREEN_WIDTH, height: IMAGE_HEIGHT }} source={require('../../assets/images/img_background5.jpg')} />
                    {
                        theme === 'dark' ?
                            <Image style={{ opacity: 0.6, position: 'absolute', bottom: 0, width: '100%', height: '100%', resizeMode: 'cover' }} source={require('../../assets/images/img_overlay_top_bottom.png')} />
                            :
                            <Image style={{ opacity: 0.5, position: 'absolute', bottom: 0, width: '100%', height: '100%', resizeMode: 'cover' }} source={require('../../assets/images/img_overlay_bottom_top.png')} />
                    }
                </View>
                <View style={{ width: Constants.LAYOUT.SCREEN_WIDTH, height: 250, borderTopLeftRadius: BORDER_RADIUS, borderTopRightRadius: BORDER_RADIUS, backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.BACKGROUND_100 : THEME.DARK_COLOR.BACKGROUND_100, marginTop: -BORDER_RADIUS }} />
            </View>
        )
    }
    return (
        <View style={{ flex: 1, backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.BACKGROUND_100 : THEME.DARK_COLOR.BACKGROUND_100 }} >
            <StatusBar barStyle={Platform.OS == 'ios' ? (theme === 'dark' ? 'light-content' : 'light-content') : 'light-content'} backgroundColor={theme === 'light' ? THEME.LIGHT_COLOR.BLACK : THEME.DARK_COLOR.BLACK} />
            <HeaderView />
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flex: keyboardHeight === 0 ? 1 : undefined }}>
                <View
                    style={{
                        flex: keyboardHeight === 0 ? 1 : undefined,
                        width: Constants.LAYOUT.SCREEN_WIDTH,
                        backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.BACKGROUND_100 : THEME.DARK_COLOR.BACKGROUND_100,
                        borderTopLeftRadius: BORDER_RADIUS,
                        borderTopRightRadius: BORDER_RADIUS,
                        paddingTop: BORDER_RADIUS,
                        marginTop: keyboardHeight === 0 ? (IMAGE_HEIGHT - BORDER_RADIUS) : insets.top + 75,
                        paddingBottom: keyboardHeight === 0 ? (insets.bottom + 25) : keyboardHeight + 25
                    }}>
                    <FastImage resizeMode={FastImage.resizeMode.cover} style={{ opacity: 0.2, position: 'absolute', top: 0, width: Constants.LAYOUT.SCREEN_WIDTH, height: Constants.LAYOUT.SCREEN_WIDTH * 1080 * 1.3 / 1920 }} source={require('../../assets/images/img_smoke1.png')} />
                    <View style={{ paddingHorizontal: 25 }}>
                        <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_SEMIBOLD, fontSize: Constants.FONT_SIZE.FT22, color: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_100 : THEME.DARK_COLOR.TEXT_100 }}>
                            {"Forgot Password?"}
                        </Text>
                        <Text style={{ marginTop: 8, fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT15, color: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_200 : THEME.DARK_COLOR.TEXT_200 }}>
                            {"We will send you an email with a link to reset your password."}
                        </Text>
                        <StyledTextInput
                            containerStyle={{ marginTop: 55 }}
                            placeholder={""}
                            keyboardType={"email-address"}
                            returnKeyType={"done"}
                            onChangeValue={(value) => {
                                setEmail(value)
                            }}
                            onSubmitEditing={() => {
                                Keyboard.dismiss()
                            }}
                            icon={require('../../assets/images/icon_email.png')}
                            label={"Email Address"} />
                    </View>
                    <StyledButton
                        containerStyle={{ alignSelf: 'center', marginTop: 55, width: Constants.LAYOUT.SCREEN_WIDTH - 50 }}
                        title={"Request Link"}
                        onPress={onRequestPress} />
                </View>
            </ScrollView>
            <StyledIconButton
                containerStyle={{ position: 'absolute', top: insets.top + (Constants.LAYOUT.HEADER_HEIGHT - 42) / 2, left: 25 }}
                icon={require('../../assets/images/icon_back1.png')}
                onPress={onBackPress} />
            <Spinner visible={loading} />
        </View>
    )
}

export default ForgotPasswordScreen;