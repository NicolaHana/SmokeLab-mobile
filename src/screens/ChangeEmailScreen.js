import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Platform,
    StatusBar,
    ScrollView,
    Keyboard,
    LayoutAnimation
} from 'react-native';
import Constants from '../common/Constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StyledButton from '../components/StyledButton';
import StyledTextInput from '../components/StyledTextInput';
import Spinner from '../components/Spinner';
import StyledHeaderTitle from '../components/StyledHeaderTitle';
import StyledBackButton from '../components/StyledBackButton';
import THEME from '../common/Theme';
import { getLoggedInUser, presentAlertMessage } from '../common/Functions';
import { EmailAuthProvider, getAuth, reauthenticateWithCredential, updateEmail } from "firebase/auth";
import { getFirestore, doc, collection, updateDoc, serverTimestamp } from 'firebase/firestore/lite';
import { useAuthContext } from '../contexts/AuthContext';
import FastImage from 'react-native-fast-image';
import { useThemeContext } from '../contexts/ThemeContext';

function ChangeEmailScreen({ navigation }) {
    const { theme } = useThemeContext()
    const { sessionUpdate } = useAuthContext()
    const auth = getAuth()
    const firestore = getFirestore()
    const insets = useSafeAreaInsets()
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState(auth.currentUser.email)
    const [password, setPassword] = useState('')
    const [keyboardHeight, setKeyboardHeight] = useState(0)
    const passwordTextInputRef = useRef()
    const emailTextInputRef = useRef()
    useEffect(() => {
        loadData()
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
        setKeyboardHeight(Platform.OS === 'ios' ? height : 0)
    }
    const keyboardDidHide = (event) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setKeyboardHeight(0)
    }
    const loadData = async () => {
        sessionUpdate(await getLoggedInUser())
    }
    const onUpdatePress = () => {
        if (email === "" || email === auth.currentUser.email) return
        if (password === "") return

        updateUserEmail()
    }
    const updateUserEmail = async () => {
        Keyboard.dismiss()

        try {
            setLoading(true)

            await reauthenticate(password)
            await updateEmail(auth.currentUser, email)
            await updateDoc(doc(collection(firestore, 'live_users'), auth.currentUser.uid), {
                user_email: email,
                updated_at: serverTimestamp(),
            })
            setPassword('')
            sessionUpdate(await getLoggedInUser())

            setLoading(false)
            setTimeout(() => {
                presentAlertMessage({ title: "Your email address has been successfully updated." })
            }, 100);
        } catch (error) {
            setLoading(false)
            if (error.code === "auth/wrong-password") {
                setTimeout(() => {
                    presentAlertMessage({ title: "The password you entered is incorrect." })
                }, 100);
            } else if (error.code === "auth/invalid-email") {
                setTimeout(() => {
                    presentAlertMessage({ title: "The email address you entered is invalid." })
                }, 100);
            } else if (error.code === "auth/email-already-in-use") {
                setTimeout(() => {
                    presentAlertMessage({ title: "There is already an account associated with this email address." })
                }, 100);
            } else {
                setTimeout(() => {
                    presentAlertMessage({ title: "Some problems occurred, please try again." })
                }, 100);
            }
            console.log('updateUserEmail:', error)
        }
    }
    const reauthenticate = (password) => {
        const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
        return reauthenticateWithCredential(auth.currentUser, credential)
    }
    const onBackPress = () => {
        navigation.pop()
    }
    return (
        <View style={{ flex: 1, backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.BACKGROUND_100 : THEME.DARK_COLOR.BACKGROUND_100 }} >
            <StatusBar barStyle={Platform.OS == 'ios' ? (theme === 'dark' ? 'light-content' : 'dark-content') : 'light-content'} backgroundColor={theme === 'light' ? THEME.LIGHT_COLOR.BLACK : THEME.DARK_COLOR.BLACK} />
            <FastImage resizeMode={FastImage.resizeMode.cover} style={{ opacity: 0.2, position: 'absolute', top: 0, width: Constants.LAYOUT.SCREEN_WIDTH, height: Constants.LAYOUT.SCREEN_WIDTH * 1080 * 2 / 1920 }} source={require('../../assets/images/img_smoke1.png')} />
            <View style={{ marginTop: insets.top, height: Constants.LAYOUT.HEADER_HEIGHT, justifyContent: 'center' }}>
                <StyledBackButton
                    containerStyle={{ position: 'absolute', left: 25, top: (Constants.LAYOUT.HEADER_HEIGHT - 24) / 2 }}
                    onPress={onBackPress} />
                <StyledHeaderTitle
                    title={"Change Email Address"}
                    containerStyle={{ alignSelf: 'center' }} />
            </View>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 25, paddingBottom: 25 }}>
                <StyledTextInput
                    ref={emailTextInputRef}
                    containerStyle={{ marginTop: 35 }}
                    placeholder={""}
                    initialValue={email}
                    autoCapitalize={'words'}
                    keyboardType={"default"}
                    returnKeyType={"next"}
                    onChangeValue={(value) => {
                        setEmail(value)
                    }}
                    onSubmitEditing={() => {
                        passwordTextInputRef.current.focus()
                    }}
                    icon={require('../../assets/images/icon_email.png')}
                    label={"New Email Address"} />
                <StyledTextInput
                    ref={passwordTextInputRef}
                    containerStyle={{ marginTop: 35 }}
                    placeholder={""}
                    initialValue={password}
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
            </ScrollView>
            <View style={{
                paddingBottom: keyboardHeight === 0 ? (insets.bottom + 15) : (keyboardHeight + 15),
                paddingTop: 15,
                backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.BACKGROUND_100 : THEME.DARK_COLOR.BACKGROUND_100,
                shadowColor: theme === 'light' ? THEME.LIGHT_COLOR.SHADOW : THEME.DARK_COLOR.SHADOW,
                shadowOffset: {
                    width: 0,
                    height: -5,
                },
                shadowOpacity: 0.08,
                shadowRadius: 4.59,
                elevation: 5,
            }}>
                <StyledButton
                    containerStyle={{ alignSelf: 'center', width: Constants.LAYOUT.SCREEN_WIDTH - 50 }}
                    title={"Update"}
                    onPress={onUpdatePress} />
            </View>
            <Spinner visible={loading} />
        </View>
    )
}

export default ChangeEmailScreen;