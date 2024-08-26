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
import { getAuth, updateProfile } from "firebase/auth";
import { getFirestore, doc, collection, setDoc, serverTimestamp } from 'firebase/firestore/lite';
import StyledImagePicker from '../components/StyledImagePicker';
import { getLoggedInUser, uploadFileToStorage } from '../common/Functions';
import StyledDateInput from '../components/StyledDateInput';
import moment from 'moment';
import THEME from '../common/Theme';
import { useAuthContext } from '../contexts/AuthContext';
import { OneSignal } from 'react-native-onesignal';
import FastImage from 'react-native-fast-image';
import { useThemeContext } from '../contexts/ThemeContext';

function CreateProfileScreen({ route }) {
    const { theme } = useThemeContext()
    const { sessionStart } = useAuthContext()
    const auth = getAuth()
    const firestore = getFirestore()
    const insets = useSafeAreaInsets()
    const [photo, setPhoto] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [city, setCity] = useState('')
    const [dateOfBirth, setDateOfBirth] = useState('')
    const [smoker, setSmoker] = useState('')
    const [thermometer, setThermometer] = useState('')
    const [loading, setLoading] = useState(false)
    const [keyboardHeight, setKeyboardHeight] = useState(0)
    const imagePickerRef = useRef()
    const nameTextInputRef = useRef()
    const emailTextInputRef = useRef()
    const cityTextInputRef = useRef()
    const smokerTextInputRef = useRef()
    const thermometerTextInputRef = useRef()
    const contentScrollViewRef = useRef()
    useEffect(() => {
        setEmail(route.params.email)
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
    const onContinuePress = () => {
        if (name === "") return
        if (email === "") return
        if (city === "") return
        if (dateOfBirth === "") return

        createUserProfile()
    }
    const onPhotoPress = () => {
        imagePickerRef.current.present()
    }
    const createUserProfile = async () => {
        Keyboard.dismiss()

        try {
            setLoading(true)

            let userPhotoURL = ''
            if (photo !== '') {
                userPhotoURL = await uploadFileToStorage(`live_user_photos/${auth.currentUser.uid}/profile.jpg`, photo.path)
            }

            const oneSignalPlayerId = await OneSignal.User.pushSubscription.getIdAsync()
            await setDoc(doc(collection(firestore, 'live_users'), auth.currentUser.uid), {
                document_id: auth.currentUser.uid,
                user_id: auth.currentUser.uid,
                user_email: email,
                user_password: route.params.password,
                user_name: name,
                user_birth_date: moment(dateOfBirth).toDate(),
                user_city: city,
                user_photo: userPhotoURL,
                user_smoker_grill: smoker,
                user_thermometer: thermometer,
                is_unlimited: false,
                purchase_count: 3,
                onesignal_player_id: oneSignalPlayerId,
                created_at: serverTimestamp(),
                updated_at: serverTimestamp(),
                last_logged_in_at: serverTimestamp(),

                user_username: name,
                user_screen_name: name,
            })
            await updateProfile(auth.currentUser, { displayName: name, photoURL: userPhotoURL })
            await createKlaviyoCustomer()
            setLoading(false)

            sessionStart(await getLoggedInUser())
        } catch (error) {
            console.log('createUserProfile:', error)
            setLoading(false)
            setTimeout(() => {
                presentAlertMessage({ title: "Some problems occurred, please try again." })
            }, 100);
        }
    }
    const createKlaviyoCustomer = async () => {
        const options = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                revision: '2023-10-15',
                'content-type': 'application/json',
                Authorization: `Klaviyo-API-Key ${Constants.KLAVIYO.PRIVATE_API_KEY}`
            },
            body: JSON.stringify({
                data: {
                    type: 'profile',
                    attributes: {
                        email: `${email}`,
                        first_name: `${name.split(" ")[0]}`,
                        last_name: `${name.includes(" ") ? name.split(" ")[1] : ''}`
                    }
                }
            })
        };
        await fetch('https://a.klaviyo.com/api/profiles/', options)
    }
    return (
        <View style={{ flex: 1, backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.BACKGROUND_100 : THEME.DARK_COLOR.BACKGROUND_100 }} >
            <StatusBar barStyle={Platform.OS == 'ios' ? (theme === 'dark' ? 'light-content' : 'dark-content') : 'light-content'} backgroundColor={theme === 'light' ? THEME.LIGHT_COLOR.BLACK : THEME.DARK_COLOR.BLACK} />
            <StyledImagePicker
                ref={imagePickerRef}
                title={null}
                multiple={false}
                onImagesPicked={(photos) => {
                    setPhoto(photos[0])
                }}
            />
            <FastImage resizeMode={FastImage.resizeMode.cover} style={{ opacity: 0.2, position: 'absolute', top: 0, width: Constants.LAYOUT.SCREEN_WIDTH, height: Constants.LAYOUT.SCREEN_WIDTH * 1080 * 2 / 1920 }} source={require('../../assets/images/img_smoke1.png')} />
            <View style={{ marginTop: insets.top, height: Constants.LAYOUT.HEADER_HEIGHT, justifyContent: 'center' }}>
                <Text style={{ alignSelf: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_SEMIBOLD, fontSize: Constants.FONT_SIZE.FT20, color: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_100 : THEME.DARK_COLOR.TEXT_100 }}>
                    {"Create Profile"}
                </Text>
            </View>
            <ScrollView
                ref={contentScrollViewRef}
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingHorizontal: 25, paddingBottom: 25 }}>
                <TouchableOpacity onPress={onPhotoPress} style={{ borderColor: theme === 'light' ? THEME.LIGHT_COLOR.GRAIDENT_LIGHT : THEME.DARK_COLOR.GRAIDENT_LIGHT, alignSelf: 'center', marginTop: 20 }}>
                    <Image style={{ width: 96, height: 96, borderRadius: 30, resizeMode: 'cover' }} source={photo === '' ? require('../../assets/images/img_user_placeholder.png') : { uri: photo.path }} />
                    <TouchableOpacity onPress={onPhotoPress} style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.PRIMARY : THEME.DARK_COLOR.PRIMARY, position: 'absolute', right: -8, bottom: -8, alignItems: 'center', justifyContent: 'center' }}>
                        <Image style={{ height: 16, width: 16, tintColor: theme === 'light' ? THEME.LIGHT_COLOR.WHITE : THEME.DARK_COLOR.WHITE }} source={require('../../assets/images/icon_edit.png')} />
                    </TouchableOpacity>
                </TouchableOpacity>
                <StyledTextInput
                    ref={nameTextInputRef}
                    containerStyle={{ marginTop: 45 }}
                    placeholder={""}
                    initialValue={name}
                    autoCapitalize={'words'}
                    keyboardType={"default"}
                    returnKeyType={"next"}
                    onFocus={() => {
                        setTimeout(() => {
                            contentScrollViewRef.current.scrollTo({ y: 136, animated: true })
                        }, 500);
                    }}
                    onChangeValue={(value) => {
                        setName(value)
                    }}
                    onSubmitEditing={() => {
                        emailTextInputRef.current.focus()
                    }}
                    icon={require('../../assets/images/icon_user.png')}
                    label={"Name (Required)"} />
                {/* <StyledTextInput
                    ref={emailTextInputRef}
                    containerStyle={{ marginTop: 35 }}
                    placeholder={""}
                    initialValue={email}
                    keyboardType={"email-address"}
                    returnKeyType={"next"}
                    onChangeValue={(value) => {
                        setEmail(value)
                    }}
                    onSubmitEditing={() => {
                        cityTextInputRef.current.focus()
                    }}
                    icon={require('../../assets/images/icon_email.png')}
                    label={"Email Address"} /> */}
                <StyledTextInput
                    ref={cityTextInputRef}
                    containerStyle={{ marginTop: 35 }}
                    placeholder={""}
                    initialValue={city}
                    autoCapitalize={'words'}
                    keyboardType={"default"}
                    returnKeyType={"next"}
                    onFocus={() => {
                        setTimeout(() => {
                            contentScrollViewRef.current.scrollTo({ y: 136 + 48 * 1 + 35 * 1, animated: true })
                        }, 500);
                    }}
                    onChangeValue={(value) => {
                        setCity(value)
                    }}
                    onSubmitEditing={() => {
                        Keyboard.dismiss()
                    }}
                    icon={require('../../assets/images/icon_location.png')}
                    label={"City, State (Required)"} />
                <StyledDateInput
                    containerStyle={{ marginTop: 35 }}
                    placeholder={""}
                    initialValue={''}
                    minimumDate={moment().add('-100', 'years').toDate()}
                    maximumDate={moment().toDate()}
                    onChangeValue={(value) => {
                        setDateOfBirth(value)
                    }}
                    onShown={() => {
                        Keyboard.dismiss()
                    }}
                    icon={require('../../assets/images/icon_date.png')}
                    label={"Date of Birth (Required)"} />
                <StyledTextInput
                    ref={smokerTextInputRef}
                    containerStyle={{ marginTop: 35, height: 120 }}
                    placeholder={"e.g. Big Green Egg Large\nOutlaw Charcoal Grill"}
                    multiline={true}
                    initialValue={smoker}
                    autoCapitalize={'words'}
                    keyboardType={"default"}
                    returnKeyType={"done"}
                    onFocus={() => {
                        setTimeout(() => {
                            contentScrollViewRef.current.scrollTo({ y: 136 + 48 * 3 + 35 * 3, animated: true })
                        }, 500);
                    }}
                    onChangeValue={(value) => {
                        setSmoker(value)
                    }}
                    onSubmitEditing={() => {
                        thermometerTextInputRef.current.focus()
                    }}
                    icon={require('../../assets/images/icon_grill.png')}
                    label={"Smoker/Grill (Optional)"} />
                <StyledTextInput
                    ref={thermometerTextInputRef}
                    containerStyle={{ marginTop: 35, height: 120 }}
                    placeholder={"e.g. Lavatools Javelin Pro Duo Digital\nChar-Broil Instant-Read Digital"}
                    initialValue={thermometer}
                    multiline={true}
                    autoCapitalize={'words'}
                    keyboardType={"default"}
                    returnKeyType={"done"}
                    onFocus={() => {
                        setTimeout(() => {
                            contentScrollViewRef.current.scrollTo({ y: 136 + 48 * 4 + 35 * 4, animated: true })
                        }, 500);
                    }}
                    onChangeValue={(value) => {
                        setThermometer(value)
                    }}
                    onSubmitEditing={() => {
                        thermometerTextInputRef.current.focus()
                    }}
                    icon={require('../../assets/images/icon_thermometer.png')}
                    label={"Thermometer (Optional)"} />
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
                    title={"Start Free Trial"}
                    onPress={onContinuePress} />
            </View>
            <Spinner visible={loading} />
        </View>
    )
}

export default CreateProfileScreen;