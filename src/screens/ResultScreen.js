import React, { useEffect, useRef, useState } from 'react';
import {
    Image,
    View,
    Platform,
    StatusBar,
    Text,
    TouchableOpacity,
    Keyboard,
    LayoutAnimation,
    ScrollView,
    AppState
} from 'react-native';
import Constants from '../common/Constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StyledButton from '../components/StyledButton';
import StyledTextInput from '../components/StyledTextInput';
import Spinner from '../components/Spinner';
import StyledSlider from '../components/StyledSlider';
import BottomMenu from '../components/BottomMenu';
import StyledBackButton from '../components/StyledBackButton';
import StyledHeaderTitle from '../components/StyledHeaderTitle';
import { getAuth } from "firebase/auth";
import { getFirestore, doc, collection, getDoc, updateDoc, deleteField, serverTimestamp } from 'firebase/firestore/lite';
import { getLoggedInUser, navigateAndReset, presentAlertMessage, uploadFileToStorage } from '../common/Functions';
import StyledImagePicker from '../components/StyledImagePicker';
import THEME from '../common/Theme';
import FastImage from 'react-native-fast-image';
import { useAuthContext } from '../contexts/AuthContext';
import { useThemeContext } from '../contexts/ThemeContext';

function ResultScreen({ navigation, route }) {
    const { theme } = useThemeContext()
    const { sessionUpdate } = useAuthContext()
    const insets = useSafeAreaInsets()
    const auth = getAuth()
    const firestore = getFirestore()
    const [loading, setLoading] = useState(false)
    const [cook, setCook] = useState({
        id: null,
        appearance: 0,
        taste: 0,
        tenderness: 0,
        overall: 0,
        comment: '',
        graphPhoto: '',
        meatPhotos: [],
        isActive: false
    })
    const [keyboardHeight, setKeyboardHeight] = useState(0)
    const commentTextInputRef = useRef()
    const meatPhotoPickerRef = useRef()
    const graphPhotoPickerRef = useRef()
    const cookRef = useRef(cook)
    const contentScrollViewRef = useRef()
    const [isSaved, setIsSaved] = useState(false)
    useEffect(() => {
        loadCook()
        return () => {
            console.log(`saveResult from loadCook -> ${isSaved}`)
            // saveResult(cookRef.current);
        };
    }, []);
    useEffect(() => {
        const subscription = AppState.addEventListener("change", nextAppState => {
            if (nextAppState === 'background') {
                console.log('saveResult from background - nextAppState')
                // saveResult(cookRef.current);
            }

        });
        return () => {
            subscription.remove();
        };
    }, []);
    useEffect(() => {
        cookRef.current = cook
        return () => { };
    }, [cook]);
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
    const keyboardDidHide = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setKeyboardHeight(0)
    }
    const loadCook = async () => {
        try {
            setLoading(true)
            const documentSnapShot = await getDoc(doc(collection(firestore, 'live_cooks'), route.params.id))

            setLoading(false)
            if (documentSnapShot.exists()) {
                setCook(prevCook => ({
                    ...prevCook,
                    id: documentSnapShot.data().cook_id ? documentSnapShot.data().cook_id : null,
                    appearance: documentSnapShot.data().meat_ratings ? documentSnapShot.data().meat_ratings.appearance : 0,
                    taste: documentSnapShot.data().meat_ratings ? documentSnapShot.data().meat_ratings.taste : 0,
                    tenderness: documentSnapShot.data().meat_ratings ? documentSnapShot.data().meat_ratings.tenderness : 0,
                    overall: documentSnapShot.data().meat_ratings ? documentSnapShot.data().meat_ratings.overal_rating : 0,
                    comment: documentSnapShot.data().meat_ratings_comment ? documentSnapShot.data().meat_ratings_comment : '',
                    graphPhoto: documentSnapShot.data().meat_graph_photo ? documentSnapShot.data().meat_graph_photo : '',
                    meatPhotos: documentSnapShot.data().meat_photos ? documentSnapShot.data().meat_photos : [],
                    isActive: documentSnapShot.data().is_active ? documentSnapShot.data().is_active : false,
                }))
            } else {
                setTimeout(() => {
                    presentAlertMessage({ title: "Some problems occurred, please try again." })
                }, 100);
            }
        } catch (error) {
            console.log('loadCook:', error)
            setLoading(false)
        }
    }
    const saveResult = async (cook, final = false) => {
        console.log('===========================>>>>>>>>>>')

        Keyboard.dismiss();

        if (isSaved){ 
            console.log('----already saved! haha!!')
            return 
        }

        try {
            console.log('---saving process started!')
            let graphPhotoURL = ''
            if (cook.graphPhoto !== '') {
                if (final && cook.graphPhoto.path) {
                    console.log('---uploading a graph photo...')
                    graphPhotoURL = await uploadFileToStorage(`live_thermometer_photos/${auth.currentUser.uid}/${route.params.id}/graph_photo.jpg`, cook.graphPhoto.path)
                } else {
                    console.log(`---graph photo exists - ${cook.graphPhoto}`)
                    graphPhotoURL = cook.graphPhoto
                }
            }
            console.log(`---graph photo - ${graphPhotoURL}`)

            let meatPhotoURLs = []
            if (cook.meatPhotos.length > 0) {
                console.log('---meat photos...')
                let meatPhotoUploadPromises = cook.meatPhotos.map((meatPhoto, index) => {
                    if (final && meatPhoto.path) {
                        console.log(`---uploading a meat photo ${index}`)
                        console.log(`live_meat_photos/${auth.currentUser.uid}/${route.params.id}/meat_photo_${index}.jpg: original image path: ${meatPhoto.path}`)
                        return uploadFileToStorage(`live_meat_photos/${auth.currentUser.uid}/${route.params.id}/meat_photo_${index}.jpg`, meatPhoto.path)
                    } else {
                        console.log(`---meat photo exists - ${index}: ${meatPhoto}`)
                        return meatPhoto
                    }
                })
                meatPhotoURLs = await Promise.all(meatPhotoUploadPromises)
            }
            console.log(`---meat photos - ${meatPhotoURLs}`)

            const values = {
                meat_ratings: {
                    appearance: cook.appearance,
                    taste: cook.taste,
                    tenderness: cook.tenderness,
                    overal_rating: cook.overall,
                },
                meat_ratings_comment: cook.comment,
                meat_graph_photo: graphPhotoURL,
                meat_photos: meatPhotoURLs,
                updated_at: serverTimestamp()
            }
            if (final) {
                values['is_active'] = true
            }
            await updateDoc(doc(collection(firestore, 'live_cooks'), route.params.id), values)
            if (final) {
                await updateDoc(doc(collection(firestore, 'live_users'), auth.currentUser.uid), {
                    last_cook_id: deleteField()
                })
            }
            console.log('Result saved successfully!')

            if (final){
                setIsSaved(true)
                console.log(`save flag changed -> ${isSaved}`)
            }
            sessionUpdate(await getLoggedInUser())
        } catch (error) {
            console.log('Failed to save result')
            throw error
        }
    }
    const onFinishPress = async () => {
        try {
            setLoading(true)
            console.log('saveResult from FinishProcess')
            await saveResult(cook, true)
            setLoading(false)
            setTimeout(() => {
                if (navigation.getState().routes.length > 4) {
                    navigation.pop(4)
                } else if (navigation.getState().routes.length > 3) {
                    navigation.pop(3)
                }
                navigation.push('Cook', { id: route.params.id })
            }, 100);
        } catch (error) {
            setLoading(false)
        }
    }
    const onBackPress = () => {
        navigation.canGoBack() && navigation.goBack()
    }
    const onSavePress = async () => {
        try {
            setLoading(true)
            console.log('saveResult from onSaveProcess')
            await saveResult(cook)
            setLoading(false)
        } catch (error) {
            setLoading(false)
        }
    }
    const onAddGraphPhotoPress = () => {
        Keyboard.dismiss()
        graphPhotoPickerRef.current.present()
    }
    const onAddMeatPhotoPress = () => {
        Keyboard.dismiss()
        meatPhotoPickerRef.current.present()
    }
    const PhotoItem = ({ index, photo }) => {
        const onDeletePress = () => {
            setCook(prevCook => ({ ...prevCook, meatPhotos: prevCook.meatPhotos.filter((_, i) => index !== i) }))
        }
        return (
            <View style={{ marginLeft: index === 0 ? 0 : 8, borderWidth: 1, borderRadius: 8, borderColor: theme === 'light' ? THEME.LIGHT_COLOR.TRANSPARENT : THEME.DARK_COLOR.TRANSPARENT, width: 100, height: 100 }}>
                <FastImage
                    resizeMode={FastImage.resizeMode.cover}
                    style={{ width: 100, height: 100, borderRadius: 8, resizeMode: 'cover' }}
                    source={{ uri: photo.path ? photo.path : photo, priority: FastImage.priority.high }} />
                <TouchableOpacity onPress={onDeletePress} style={{ position: 'absolute', right: 5, top: 5, width: 28, height: 28, borderRadius: 28, backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.WHITE : THEME.DARK_COLOR.WHITE, alignItems: 'center', justifyContent: 'center' }}>
                    <Image style={{ width: 20, height: 20, tintColor: theme === 'light' ? THEME.LIGHT_COLOR.DESTRUCTIVE : THEME.DARK_COLOR.DESTRUCTIVE }} source={require('../../assets/images/icon_delete.png')} />
                </TouchableOpacity>
            </View>
        )
    }
    const PhotoAddItem = ({ index }) => {
        return (
            <TouchableOpacity onPress={onAddMeatPhotoPress} style={{ marginLeft: index === 0 ? 0 : 8, width: 100, height: 100, borderRadius: 8, borderWidth: 1, borderStyle: 'dashed', borderColor: theme === 'light' ? THEME.LIGHT_COLOR.PRIMARY : THEME.DARK_COLOR.PRIMARY, alignItems: 'center', justifyContent: 'center' }}>
                <Image style={{ width: 20, height: 20, tintColor: theme === 'light' ? THEME.LIGHT_COLOR.DESTRUCTIVE : THEME.DARK_COLOR.DESTRUCTIVE }} source={require('../../assets/images/icon_add.png')} />
            </TouchableOpacity>
        )
    }
    return (
        <View style={{ flex: 1, backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.BACKGROUND_100 : THEME.DARK_COLOR.BACKGROUND_100 }} >
            <StatusBar barStyle={Platform.OS == 'ios' ? (theme === 'dark' ? 'light-content' : 'dark-content') : 'light-content'} backgroundColor={theme === 'light' ? THEME.LIGHT_COLOR.BLACK : THEME.DARK_COLOR.BLACK} />
            <StyledImagePicker
                ref={graphPhotoPickerRef}
                title={null}
                multiple={false}
                onImagesPicked={(photos) => {
                    setCook(prevCook => ({ ...prevCook, graphPhoto: photos[0] }))
                }}
            />
            <StyledImagePicker
                ref={meatPhotoPickerRef}
                title={null}
                multiple={true}
                onImagesPicked={(photos) => {
                    setCook(prevCook => ({ ...prevCook, meatPhotos: [...prevCook.meatPhotos, ...photos] }))
                }}
            />
            <FastImage resizeMode={FastImage.resizeMode.cover} style={{ opacity: 0.2, position: 'absolute', top: 0, width: Constants.LAYOUT.SCREEN_WIDTH, height: Constants.LAYOUT.SCREEN_WIDTH * 1080 * 2 / 1920 }} source={require('../../assets/images/img_smoke1.png')} />
            <View style={{ marginTop: insets.top, height: Constants.LAYOUT.HEADER_HEIGHT, justifyContent: 'center' }}>
                <StyledBackButton
                    containerStyle={{ position: 'absolute', left: 25, top: (Constants.LAYOUT.HEADER_HEIGHT - 24) / 2 }}
                    onPress={onBackPress} />
                <StyledHeaderTitle
                    title={cook.id ? "The Results" : "Loading..."}
                    containerStyle={{ alignSelf: 'center' }} />
            </View>
            {
                cook.id &&
                <ScrollView
                    ref={contentScrollViewRef}
                    keyboardShouldPersistTaps={'handled'}
                    style={{ flex: 1 }}
                    contentContainerStyle={{ alignItems: 'center', paddingBottom: Platform.OS === 'ios' ? (keyboardHeight === 0 ? 25 : (keyboardHeight + 10)) : (keyboardHeight === 0 ? 25 : 10) }} >
                    <StyledSlider
                        containerStyle={{ marginTop: 35 }}
                        label={"Appearance"}
                        min={0}
                        max={10}
                        initialValue={cook.appearance}
                        onChangeValue={(value) => {
                            setCook(prevCook => ({ ...prevCook, appearance: value }))
                        }} />
                    <StyledSlider
                        containerStyle={{ marginTop: 40 }}
                        label={"Taste"}
                        min={0}
                        max={10}
                        initialValue={cook.taste}
                        onChangeValue={(value) => {
                            setCook(prevCook => ({ ...prevCook, taste: value }))
                        }} />
                    <StyledSlider
                        containerStyle={{ marginTop: 40 }}
                        label={"Tenderness"}
                        min={0}
                        max={10}
                        initialValue={cook.tenderness}
                        onChangeValue={(value) => {
                            setCook(prevCook => ({ ...prevCook, tenderness: value }))
                        }} />
                    <StyledSlider
                        containerStyle={{ marginTop: 40 }}
                        label={"Overall Rating"}
                        min={0}
                        max={10}
                        initialValue={cook.overall}
                        onChangeValue={(value) => {
                            setCook(prevCook => ({ ...prevCook, overall: value }))
                        }} />
                    <StyledTextInput
                        ref={commentTextInputRef}
                        containerStyle={{ width: Constants.LAYOUT.SCREEN_WIDTH - 50, height: 120, marginTop: 35 }}
                        placeholder={""}
                        initialValue={cook.comment}
                        autoCapitalize={"sentences"}
                        keyboardType={"default"}
                        returnKeyType={"next"}
                        onFocus={() => {
                            setTimeout(() => {
                                contentScrollViewRef.current.scrollTo({ y: 300, animated: true })
                            }, 500);
                        }}
                        onChangeValue={(value) => {
                            setCook(prevCook => ({ ...prevCook, comment: value }))
                        }}
                        onSubmitEditing={() => {
                            Keyboard.dismiss()
                        }}
                        multiline={true}
                        icon={require('../../assets/images/icon_note.png')}
                        label={"Comment/Notes"} />
                    <View style={{ marginTop: 35 }}>
                        <Text style={{ position: 'absolute', top: -25, left: 0, color: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_INPUT_LABEL : THEME.DARK_COLOR.TEXT_INPUT_LABEL, fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT13 }}>
                            {`Meat Photos`}
                        </Text>
                        <View style={{ height: 100 }}>
                            <ScrollView horizontal style={{ width: Constants.LAYOUT.SCREEN_WIDTH - 50 }}>
                                {
                                    cook.meatPhotos.map((photo, index) => <PhotoItem key={index.toString()} index={index} photo={photo} />)
                                }
                                <PhotoAddItem index={cook.meatPhotos.length} />
                            </ScrollView>
                        </View>
                    </View>
                    <View style={{ marginTop: 35 }}>
                        <Text style={{ position: 'absolute', top: -25, left: 0, color: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_INPUT_LABEL : THEME.DARK_COLOR.TEXT_INPUT_LABEL, fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT13 }}>
                            {`Thermometer Screenshot`}
                        </Text>
                        <TouchableOpacity onPress={onAddGraphPhotoPress} style={{ width: Constants.LAYOUT.SCREEN_WIDTH - 50, height: 100, borderRadius: 8, borderWidth: 1, borderStyle: 'dashed', borderColor: theme === 'light' ? THEME.LIGHT_COLOR.PRIMARY : THEME.DARK_COLOR.PRIMARY, alignItems: 'center', justifyContent: 'center' }}>
                            {
                                cook.graphPhoto !== '' ?
                                    <FastImage resizeMode={FastImage.resizeMode.cover} style={{ width: '100%', height: '100%' }} source={{ priority: FastImage.priority.high, uri: cook.graphPhoto.path ? cook.graphPhoto.path : cook.graphPhoto }} /> :
                                    <Image style={{ width: 20, height: 20, tintColor: theme === 'light' ? THEME.LIGHT_COLOR.DESTRUCTIVE : THEME.DARK_COLOR.DESTRUCTIVE }} source={require('../../assets/images/icon_add.png')} />
                            }
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: 15, marginBottom: 15, height: 1, width: Constants.LAYOUT.SCREEN_WIDTH - 50, backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.SEPERATOR : THEME.DARK_COLOR.SEPERATOR }} />
                    <StyledButton
                        containerStyle={{ width: Constants.LAYOUT.SCREEN_WIDTH - 50 }}
                        title={"Finish and Ready to Eat!"}
                        onPress={onFinishPress} />
                </ScrollView>
            }
            {
                cook.id && keyboardHeight == 0 &&
                <BottomMenu
                    containerStyle={{ paddingBottom: keyboardHeight === 0 ? (insets.bottom + 15) : (keyboardHeight + 15) }}
                    onHomePress={() => {
                        navigateAndReset({ navigation: navigation, tabNavigator: 'TabHome', rootScreen: 'Home' })
                    }}
                    onSavePress={onSavePress}
                    onLibraryPress={() => {
                        navigateAndReset({ navigation: navigation, tabNavigator: 'TabLibrary', rootScreen: 'Library' })
                    }}
                    onProfilePress={() => {
                        navigation.navigate('TabSettings')
                    }} />
            }
            <Spinner visible={loading} />
        </View >
    )
}

export default ResultScreen;