import React, { useEffect, useRef, useState } from 'react';
import {
    Image,
    View,
    Platform,
    StatusBar,
    Text,
    ScrollView,
    TouchableOpacity,
    Keyboard,
    LayoutAnimation
} from 'react-native';
import Constants from '../common/Constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StyledButton from '../components/StyledButton';
import StyledTextInput from '../components/StyledTextInput';
import Spinner from '../components/Spinner';
import FastImage from 'react-native-fast-image';
import { presentAlertMessage } from '../common/Functions';
import THEME from '../common/Theme';
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged } from "firebase/auth";
import { useThemeContext } from '../contexts/ThemeContext';

function RegisterScreen({ navigation }) {
    const { theme } = useThemeContext()
    const insets = useSafeAreaInsets()
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [keyboardHeight, setKeyboardHeight] = useState(0)
    const [isTermsAccepted, setIsTermsAccepted] = useState(false)
    const auth = getAuth();
    const IMAGE_HEIGHT = Constants.LAYOUT.SCREEN_WIDTH * 427 / 640
    const BORDER_RADIUS = 35
    const emailTextFieldRef = useRef()
    const passwordTextFieldRef = useRef()
    useEffect(() => {
        return () => { };
    }, []);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigation.push('CreateProfile', { email: email, password: password })
            }
        })
        return () => {
            unsubscribe();
        };
    }, [email, password]);
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
    const createUser = async () => {
        try {
            setLoading(true)
            await createUserWithEmailAndPassword(auth, email, password)

            setLoading(false)
        } catch (error) {
            console.log('createUser:', error)
            setLoading(false)
            if (error.code === "auth/invalid-email") {
                setTimeout(() => {
                    presentAlertMessage({ title: "The email address is not valid." })
                }, 100);
            } else if (error.code === "auth/email-already-in-use") {
                setTimeout(() => {
                    presentAlertMessage({ title: "There is already an account associated with this email address." })
                }, 100);
            } else if (error.code === "auth/weak-password") {
                setTimeout(() => {
                    presentAlertMessage({ title: "The password is not secure." })
                }, 100);
            } else {
                setTimeout(() => {
                    presentAlertMessage({ title: "Some problems occurred, please try again." })
                }, 100);
            }
        }
    }
    const onLogInPress = () => {
        navigation.replace('LogIn')
    }
    const onRegisterPress = () => {
        if (email === '') { return }
        if (password === '') { return }
        if (!isTermsAccepted) {
            return presentAlertMessage({ title: "Please indicate that you have read and agree to Privacy Policy and Terms and Conditions." })
        }

        createUser()
    }
    const onPrivacyPress = () => {
        navigation.push('Privacy')
    }
    const onTermsPress = () => {
        navigation.push('Terms')
    }
    const onAcceptTermsPress = () => {
        setIsTermsAccepted(!isTermsAccepted)
    }
    const HeaderView = () => {
        return (
            <View style={{ position: 'absolute', top: 0 }}>
                <View style={{}}>
                    <FastImage resizeMode={FastImage.resizeMode.cover} style={{ width: Constants.LAYOUT.SCREEN_WIDTH, height: IMAGE_HEIGHT, resizeMode: 'cover' }} source={require('../../assets/images/img_background4.jpg')} />
                    <FastImage resizeMode={FastImage.resizeMode.cover} style={{ opacity: 0.2, position: 'absolute', bottom: 0, width: '100%', height: '100%' }} source={require('../../assets/images/img_overlay_bottom_top.png')} />
                </View>
                <View style={{ width: Constants.LAYOUT.SCREEN_WIDTH, height: 250, borderTopLeftRadius: BORDER_RADIUS, borderTopRightRadius: BORDER_RADIUS, backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.BACKGROUND_100 : THEME.DARK_COLOR.BACKGROUND_100, marginTop: -BORDER_RADIUS }} />
            </View>
        )
    }
    return (
        <View style={{ flex: 1, backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.BACKGROUND_100 : THEME.DARK_COLOR.BACKGROUND_100 }} >
            <StatusBar barStyle={Platform.OS == 'ios' ? (theme === 'dark' ? 'light-content' : 'light-content') : 'light-content'} backgroundColor={theme === 'light' ? THEME.LIGHT_COLOR.BLACK : THEME.DARK_COLOR.BLACK} />
            <HeaderView />
            <ScrollView keyboardShouldPersistTaps={'handled'} style={{ flex: 1 }} contentContainerStyle={{ flex: keyboardHeight === 0 ? 1 : undefined }}>
                <View
                    style={{
                        flex: keyboardHeight === 0 ? 1 : undefined,
                        width: Constants.LAYOUT.SCREEN_WIDTH,
                        backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.BACKGROUND_100 : THEME.DARK_COLOR.BACKGROUND_100,
                        borderTopLeftRadius: BORDER_RADIUS,
                        borderTopRightRadius: BORDER_RADIUS,
                        paddingTop: BORDER_RADIUS,
                        marginTop: keyboardHeight === 0 ? (IMAGE_HEIGHT - BORDER_RADIUS) : insets.top + 25,
                        marginBottom: keyboardHeight === 0 ? (insets.bottom + 25) : keyboardHeight + 25
                    }}>
                    <FastImage resizeMode={FastImage.resizeMode.cover} style={{ opacity: 0.2, position: 'absolute', top: 0, width: Constants.LAYOUT.SCREEN_WIDTH, height: Constants.LAYOUT.SCREEN_WIDTH * 1080 * 1.3 / 1920 }} source={require('../../assets/images/img_smoke1.png')} />
                    <View style={{ paddingHorizontal: 25 }}>
                        <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_SEMIBOLD, fontSize: Constants.FONT_SIZE.FT22, color: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_100 : THEME.DARK_COLOR.TEXT_100 }}>
                            {"Create an account"}
                        </Text>
                        <Text style={{ marginTop: 8, fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT15, color: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_200 : THEME.DARK_COLOR.TEXT_200 }}>
                            {"Register your account and get started"}
                        </Text>
                        <StyledTextInput
                            ref={emailTextFieldRef}
                            containerStyle={{ marginTop: 55 }}
                            placeholder={""}
                            keyboardType={"email-address"}
                            returnKeyType={"next"}
                            onChangeValue={(value) => {
                                setEmail(value)
                            }}
                            onSubmitEditing={() => {
                                passwordTextFieldRef.current.focus()
                            }}
                            icon={require('../../assets/images/icon_email.png')}
                            label={"Email Address"} />
                        <StyledTextInput
                            ref={passwordTextFieldRef}
                            containerStyle={{ marginTop: 35 }}
                            placeholder={""}
                            secureTextEntry={true}
                            returnKeyType={"done"}
                            onChangeValue={(value) => {
                                setPassword(value)
                            }}
                            onSubmitEditing={() => {
                                Keyboard.dismiss()
                            }}
                            icon={require('../../assets/images/icon_password.png')}
                            label={"Password (Must be 6 or more characters)"} />
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
                            <TouchableOpacity onPress={onAcceptTermsPress} style={{ width: 24, height: 24, borderWidth: 1, borderRadius: 5, borderColor: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_INPUT_BORDER : THEME.DARK_COLOR.TEXT_INPUT_BORDER, alignItems: 'center', justifyContent: 'center' }}>
                                {
                                    isTermsAccepted &&
                                    <Image style={{ width: 16, height: 16, tintColor: theme === 'light' ? THEME.LIGHT_COLOR.PRIMARY : THEME.DARK_COLOR.PRIMARY }} source={require('../../assets/images/icon_check.png')} />
                                }
                            </TouchableOpacity>
                            <Text style={{ flex: 1, marginLeft: 10, fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT14, color: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_200 : THEME.DARK_COLOR.TEXT_200 }}>
                                {"By signing up for SmokeLab, you agree to our Terms and Conditions. Learn how we process your data in our "}
                                <Text onPress={onPrivacyPress} style={{ color: theme === 'light' ? THEME.LIGHT_COLOR.PRIMARY : THEME.DARK_COLOR.PRIMARY, textDecorationLine: 'underline' }}>
                                    {"Privacy Policy"}
                                </Text>
                                {" and "}
                                <Text onPress={onTermsPress} style={{ color: theme === 'light' ? THEME.LIGHT_COLOR.PRIMARY : THEME.DARK_COLOR.PRIMARY, textDecorationLine: 'underline' }}>
                                    {"Terms and Conditions"}
                                </Text>
                                {"."}
                            </Text>
                        </View>
                    </View>
                    <View style={{ flex: keyboardHeight === 0 ? 1 : undefined, justifyContent: keyboardHeight === 0 ? 'flex-end' : 'flex-start' }}>
                        <StyledButton
                            containerStyle={{ alignSelf: 'center', marginTop: 35, width: Constants.LAYOUT.SCREEN_WIDTH - 50 }}
                            title={"Register"}
                            onPress={onRegisterPress} />
                        <Text style={{ marginTop: 20, alignSelf: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT16, color: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_200 : THEME.DARK_COLOR.TEXT_200 }}>
                            {"Already have an account? "}
                            <Text onPress={onLogInPress} style={{ color: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_100 : THEME.DARK_COLOR.TEXT_100, fontFamily: Constants.FONT_FAMILY.PRIMARY_SEMIBOLD }}>
                                {"Log In"}
                            </Text>
                        </Text>
                    </View>
                </View>
            </ScrollView>
            <Spinner visible={loading} />
        </View>
    )
}

export default RegisterScreen;