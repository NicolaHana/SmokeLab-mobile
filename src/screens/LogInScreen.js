import React, { useEffect, useState } from 'react';
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
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, collection, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore/lite';
import { presentAlertMessage } from '../common/Functions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import THEME from '../common/Theme';
import { useAuthContext } from '../contexts/AuthContext';
import { OneSignal } from 'react-native-onesignal';
import { useThemeContext } from '../contexts/ThemeContext';
import analytics, { firebase } from '@react-native-firebase/analytics';

// jim.smokelab@gmail.com
// Pactus77

function LogInScreen({ navigation }) {
    const { theme } = useThemeContext()
    const { sessionStart } = useAuthContext()
    const insets = useSafeAreaInsets()
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [keyboardHeight, setKeyboardHeight] = useState(0)
    const [isRememberMe, setIsRememberMe] = useState(true)
    const auth = getAuth();
    const firestore = getFirestore()
    const IMAGE_HEIGHT = Constants.LAYOUT.SCREEN_WIDTH * 462 / 616
    const BORDER_RADIUS = 35
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                loadUser()
            }
        })
        return () => {
            unsubscribe();
        };
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
    const loadUser = async () => {
        try {
            setLoading(true)
            const documentRef = doc(collection(firestore, 'live_users'), auth.currentUser.uid)
            const documentSnapShot = await getDoc(documentRef)
            if (documentSnapShot.exists()) {
                const oneSignalPlayerId = await OneSignal.User.pushSubscription.getIdAsync()
                await updateDoc(doc(collection(firestore, 'live_users'), auth.currentUser.uid), {
                    onesignal_player_id: oneSignalPlayerId,
                    last_logged_in_at: serverTimestamp()
                })
                setLoading(false)
                sessionStart(documentSnapShot.data())
            } else {
                setLoading(false)
                setTimeout(() => {
                    navigation.push('CreateProfile', { email: email, password: password })
                }, 100);
            }
        } catch (error) {
            console.log('loadUser:', error)
            setLoading(false)
            setTimeout(() => {
                presentAlertMessage({ title: "Some problems occurred, please try again." })
            }, 100);
        }
    }
    const savePassword = async () => {
        await AsyncStorage.setItem('credential', JSON.stringify({ email: email, password: password }))
    }
    const removePassword = async () => {
        await AsyncStorage.removeItem('credential')
    }
    const signIn = async () => {
        try {
            setLoading(true)
            await signInWithEmailAndPassword(auth, email, password)

            // Send Analytics Event
            const appInstanceId = await analytics().getSessionId();
            console.log('firebase.onLoginButtonPress', appInstanceId)
            await analytics().logEvent('Signin', {
                id: 3745092,
                item: 'mens grey t-shirt',
                description: ['round neck', 'long sleeved'],
                size: 'L',
              });
            console.log('logEvent Success');
            // ----------------------------------------------------------------

            if (isRememberMe) {
                await savePassword()
            } else {
                await removePassword()
            }

            setLoading(false)
        } catch (error) {
            console.log('signIn:', error)
            setLoading(false)
            if (error.code === "auth/invalid-email") {
                setTimeout(() => {
                    presentAlertMessage({ title: "The email address is not valid." })
                }, 100);
            } else if (error.code === "auth/user-not-found") {
                setTimeout(() => {
                    presentAlertMessage({ title: "There is no user associated with this email." })
                }, 100);
            } else if (error.code === "auth/wrong-password") {
                setTimeout(() => {
                    presentAlertMessage({ title: "The email address or password is incorrect." })
                }, 100);
            } else if (error.code === "auth/user-disabled") {
                setTimeout(() => {
                    presentAlertMessage({ title: "The user associated with this email address has been disabled." })
                }, 100);
            } else {
                setTimeout(() => {
                    presentAlertMessage({ title: "Some problems occurred, please try again." })
                }, 100);
            }
        }
    }
    const onLogInPress = () => {
        if (email === '') { return }
        if (password === '') { return }

        signIn()
    }
    const onRegisterPress = () => {
        navigation.replace('Register')
    }
    const onForgotPasswordPress = () => {
        navigation.push('ForgotPassword')
    }
    const onRememberPress = () => {
        setIsRememberMe(!isRememberMe)
    }
    const HeaderView = () => {
        useEffect(() => {
            firebase.analytics().logEvent('button_clicked', { button_id: 'my_button' });
        }, []);
        return (
            <View style={{ position: 'absolute', top: 0 }}>
                <View style={{}}>
                    <FastImage resizeMode={FastImage.resizeMode.cover} style={{ width: Constants.LAYOUT.SCREEN_WIDTH, height: IMAGE_HEIGHT }} source={require('../../assets/images/img_background3.jpg')} />
                    {
                        theme === 'dark' ?
                            <FastImage resizeMode={FastImage.resizeMode.cover} style={{ opacity: 0.6, position: 'absolute', bottom: 0, width: '100%', height: '100%' }} source={require('../../assets/images/img_overlay_top_bottom.png')} />
                            :
                            <FastImage resizeMode={FastImage.resizeMode.cover} style={{ opacity: 0.5, position: 'absolute', bottom: 0, width: '100%', height: '100%' }} source={require('../../assets/images/img_overlay_bottom_top.png')} />
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
            <ScrollView keyboardShouldPersistTaps={'handled'} style={{ flex: 1 }} contentContainerStyle={{ flex: keyboardHeight === 0 ? 1 : undefined }}>
                <View
                    style={{
                        flex: keyboardHeight === 0 ? 1 : undefined,
                        width: Constants.LAYOUT.SCREEN_WIDTH,
                        backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.BACKGROUND_100 : THEME.DARK_COLOR.BACKGROUND_100,
                        borderTopLeftRadius: BORDER_RADIUS,
                        borderTopRightRadius: BORDER_RADIUS,
                        paddingTop: BORDER_RADIUS,
                        overflow: 'hidden',
                        marginTop: keyboardHeight === 0 ? (IMAGE_HEIGHT - BORDER_RADIUS) : insets.top + 25,
                        paddingBottom: keyboardHeight === 0 ? (insets.bottom + 25) : keyboardHeight + 25
                    }}>
                    <FastImage resizeMode={FastImage.resizeMode.cover} style={{ opacity: 0.2, position: 'absolute', top: 0, width: Constants.LAYOUT.SCREEN_WIDTH, height: Constants.LAYOUT.SCREEN_WIDTH * 1080 * 1.3 / 1920 }} source={require('../../assets/images/img_smoke1.png')} />
                    <View style={{ paddingHorizontal: 25 }}>
                        <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_SEMIBOLD, fontSize: Constants.FONT_SIZE.FT22, color: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_100 : THEME.DARK_COLOR.TEXT_100 }}>
                            {"Welcome Back"}
                        </Text>
                        <Text style={{ marginTop: 8, fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT15, color: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_200 : THEME.DARK_COLOR.TEXT_200 }}>
                            {"Sign in to continue"}
                        </Text>
                        <StyledTextInput
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
                            label={"Password"} />
                        <View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <TouchableOpacity onPress={onRememberPress} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ width: 24, height: 24, borderWidth: 1, borderRadius: 5, borderColor: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_INPUT_BORDER : THEME.DARK_COLOR.TEXT_INPUT_BORDER, alignItems: 'center', justifyContent: 'center' }}>
                                    {
                                        isRememberMe &&
                                        <Image style={{ width: 16, height: 16, tintColor: theme === 'light' ? THEME.LIGHT_COLOR.PRIMARY : THEME.DARK_COLOR.PRIMARY }} source={require('../../assets/images/icon_check.png')} />
                                    }
                                </View>
                                <Text style={{ marginLeft: 10, fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT14, color: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_100 : THEME.DARK_COLOR.TEXT_100 }}>
                                    {"Keep me logged In?"}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={onForgotPasswordPress} style={{}}>
                                <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT14, color: theme === 'light' ? THEME.LIGHT_COLOR.PRIMARY : THEME.DARK_COLOR.PRIMARY }}>
                                    {"Forgot Password?"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ flex: keyboardHeight === 0 ? 1 : undefined, justifyContent: keyboardHeight === 0 ? 'flex-end' : 'flex-start' }}>
                        <StyledButton
                            containerStyle={{ alignSelf: 'center', marginTop: 35, width: Constants.LAYOUT.SCREEN_WIDTH - 50 }}
                            title={"Log In"}
                            onPress={onLogInPress} />
                        <Text style={{ marginTop: 20, alignSelf: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT16, color: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_200 : THEME.DARK_COLOR.TEXT_200 }}>
                            {"Don't have an account? "}
                            <Text onPress={onRegisterPress} style={{ color: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_100 : THEME.DARK_COLOR.TEXT_100, fontFamily: Constants.FONT_FAMILY.PRIMARY_SEMIBOLD }}>
                                {"Register"}
                            </Text>
                        </Text>
                    </View>
                </View>
            </ScrollView>
            <Spinner visible={loading} />
        </View>
    )
}

export default LogInScreen;