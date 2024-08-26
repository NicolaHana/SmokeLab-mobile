import React, { useEffect, useState } from 'react';
import {
    Image,
    View,
    Platform,
    StatusBar,
    Text
} from 'react-native';
import Constants from '../common/Constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StyledButton from '../components/StyledButton';
import FastImage from "react-native-fast-image";
import THEME from '../common/Theme';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, collection, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore/lite';
import { useAuthContext } from '../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OneSignal } from 'react-native-onesignal';
import axios from 'axios';
import Orientation from 'react-native-orientation-locker';
import { useThemeContext } from '../contexts/ThemeContext';

function AuthScreen({ navigation }) {
    const { theme } = useThemeContext()
    const { sessionStart } = useAuthContext()
    const insets = useSafeAreaInsets()
    const auth = getAuth();
    const firestore = getFirestore()
    const [visibleForm, setVisibleForm] = useState(false)
    useEffect(() => {
        Orientation.lockToPortrait()
        return () => { };
    }, []);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                unsubscribe()
                loadUser()
            } else {
                getCredential()
            }
        })
        return () => {
            unsubscribe();
        };
    }, []);
    const getCredential = async () => {
        try {
            let credential = await AsyncStorage.getItem('credential')
            if (credential) {
                credential = JSON.parse(credential)
                await signIn({ email: credential.email, password: credential.password })
            } else {
                setVisibleForm(true)
            }
        } catch (error) {
            setVisibleForm(true)
        }
    }
    const signIn = async ({ email, password }) => {
        try {
            await signInWithEmailAndPassword(auth, email, password)
        } catch (error) {
            throw error
        }
    }
    const loadUser = async () => {
        try {
            const documentSnapShot = await getDoc(doc(collection(firestore, 'live_users'), auth.currentUser.uid))
            if (documentSnapShot.exists()) {
                const oneSignalPlayerId = await OneSignal.User.pushSubscription.getIdAsync()
                await updateDoc(doc(collection(firestore, 'live_users'), auth.currentUser.uid), {
                    onesignal_player_id: oneSignalPlayerId,
                    last_logged_in_at: serverTimestamp()
                })

                sessionStart(documentSnapShot.data())
            } else {
                await auth.signOut()
                setVisibleForm(true)
            }
        } catch (error) {
            await auth.signOut()
            setVisibleForm(true)
        }
    }
    const sendNotification = async () => {
        try {
            const token = await OneSignal.User.pushSubscription.getIdAsync()
            const response = await axios.post('https://onesignal.com/api/v1/notifications', {
                'app_id': Constants.ONESIGNAL_APP_ID,
                'include_subscription_ids': [token],
                'contents': {
                    "en": "test"
                },
            }, {
                headers: {
                    'Content-Type': "application/json; charset=utf-8",
                    'Authorization': `Basic OTU2ZWY5ODUtNTI3MS00MDE1LTg1OWItZDk5Nzc4MTY0MGEx`
                }
            })
            console.log(response.data)
        } catch (error) {
            console.log(JSON.stringify(error))
        }
    }
    const onGetStartedPress = () => {
        navigation.replace('LogIn')
    }
    if (!visibleForm) {
        return (
            <View style={{ flex: 1, backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.PRIMARY : THEME.DARK_COLOR.PRIMARY, alignItems: 'center', justifyContent: visibleForm ? 'flex-start' : 'center' }} >
                <StatusBar barStyle={Platform.OS == 'ios' ? 'light-content' : 'light-content'} />
                <FastImage resizeMode={FastImage.resizeMode.contain} style={{ width: Constants.LAYOUT.SCREEN_WIDTH * 0.3, height: Constants.LAYOUT.SCREEN_WIDTH * 0.3, resizeMode: 'contain' }} source={require('../../assets/images/img_logo_white.png')} />
            </View>
        )
    }
    return (
        <View style={{ flex: 1, backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.BLACK : THEME.DARK_COLOR.BLACK, alignItems: 'center', justifyContent: 'center' }} >
            <StatusBar barStyle={Platform.OS == 'ios' ? (theme === 'dark' ? 'light-content' : 'dark-content') : 'light-content'} backgroundColor={theme === 'light' ? THEME.LIGHT_COLOR.BLACK : THEME.DARK_COLOR.BLACK} />
            <FastImage resizeMode={FastImage.resizeMode.cover} style={{ width: Constants.LAYOUT.SCREEN_WIDTH, height: Constants.LAYOUT.SCREEN_HEIGHT }} source={require('../../assets/images/img_background6.jpg')} />
            <Image style={{ position: 'absolute', top: 0, width: Constants.LAYOUT.SCREEN_WIDTH, height: Constants.LAYOUT.SCREEN_WIDTH / 2, resizeMode: 'cover' }} source={require('../../assets/images/img_overlay_top_bottom.png')} />
            <Image style={{ position: 'absolute', bottom: 0, width: Constants.LAYOUT.SCREEN_WIDTH, height: Constants.LAYOUT.SCREEN_WIDTH / 2, resizeMode: 'cover' }} source={require('../../assets/images/img_overlay_bottom_top.png')} />
            <View style={{ position: 'absolute', bottom: insets.bottom + 15, width: Constants.LAYOUT.SCREEN_WIDTH - 50, borderRadius: 25, backgroundColor: 'rgba(0,0,0,0.5)', paddingVertical: 20, paddingHorizontal: 20 }}>
                <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_SEMIBOLD, fontSize: Constants.FONT_SIZE.FT22, color: theme === 'light' ? THEME.LIGHT_COLOR.WHITE : THEME.DARK_COLOR.WHITE }}>
                    {"Improve your BBQ with each cook"}
                </Text>
                <Text style={{ marginTop: 5, fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT14, color: theme === 'light' ? THEME.LIGHT_COLOR.WHITE : THEME.DARK_COLOR.WHITE }}>
                    {"A convenient way for you to record what you do when you BBQ, when you do it, and how it turned out."}
                </Text>
                <StyledButton
                    containerStyle={{ marginTop: 20, width: Constants.LAYOUT.SCREEN_WIDTH - 90, height: 56, borderRadius: 28 }}
                    title={"Get Started"}
                    onPress={onGetStartedPress} />
            </View>
        </View>
    )
}

export default AuthScreen;