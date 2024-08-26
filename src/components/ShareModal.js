import React, { useEffect, useRef, useState } from 'react'
import { View, Text, Modal, TouchableOpacity, Image, ScrollView, Platform, PermissionsAndroid } from 'react-native';
import Constants from '../common/Constants';
import THEME from '../common/Theme';
import FastImage from 'react-native-fast-image';
import Share from "react-native-share";
import ViewShot from "react-native-view-shot";
import RNFS from 'react-native-fs';
import { useThemeContext } from '../contexts/ThemeContext';
import Spinner from './Spinner';
import { ShareDialog, LoginManager } from "react-native-fbsdk-next";

const ShareModal = ({ visible, cook, onClose }) => {
    if (!visible) { return null }
    const { theme } = useThemeContext()
    const canvasRef = useRef()
    const [photos, setPhotos] = useState(cook.meat_photos ? cook.meat_photos : [])
    const [type, setType] = useState(null)
    const [loading, setLoading] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const OVERLAY_OPACITY = 0.65
    useEffect(() => {
        if (type) {
            setTimeout(() => {
                captureAndShare(type)
            }, 1000);
        }
        return () => { };
    }, [type]);
    const PhotoItem = ({ index, photo }) => {
        return (
            <TouchableOpacity onPress={() => setSelectedIndex(index)} style={{ marginLeft: index === 0 ? 0 : 8, borderWidth: 1, borderRadius: 8, borderColor: theme === 'light' ? THEME.LIGHT_COLOR.TRANSPARENT : THEME.DARK_COLOR.TRANSPARENT, width: 75, height: 75, justifyContent: 'center' }}>
                <FastImage
                    resizeMode={FastImage.resizeMode.cover}
                    style={{ width: 75, height: 75, borderRadius: 8 }}
                    source={{ uri: photo, priority: FastImage.priority.high }} />
                {
                    index === selectedIndex &&
                    <Image style={{ width: 24, height: 24, resizeMode: 'contain', position: 'absolute', alignSelf: 'center' }} source={require('../../assets/images/check.png')} />
                }
            </TouchableOpacity>
        )
    }
    const SocialButton = ({ icon, label, containerStyle, onPress }) => {
        return (
            <TouchableOpacity onPress={onPress} style={[{ alignItems: 'center' }, containerStyle]}>
                <Image style={{ width: 48, height: 48, resizeMode: 'contain' }} source={icon} />
                <Text style={{ marginTop: 2, fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT14, color: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_100 : THEME.DARK_COLOR.TEXT_100 }}>
                    {label}
                </Text>
            </TouchableOpacity>
        )
    }
    const onFacebookPress = async () => {
        const hasPermission = await requestStoragePermission();
        if (!hasPermission) {
            return;
        }
        setType('Facebook')
    }
    const onInstagramPress = async () => {
        const hasPermission = await requestStoragePermission();
        if (!hasPermission) {
            return;
        }
        setType('Instagram')
    }
    const convertToBase64 = async (uri) => {
        try {
            const base64String = await RNFS.readFile(uri, 'base64');
            return base64String;
        } catch (error) {
            throw error
        }
    };
    const captureAndShare = async (type) => {
        try {
            const hasPermission = await requestStoragePermission();
            if (!hasPermission) {
                return;
            }

            setLoading(true)
            const uri = await canvasRef.current.capture()
            const base64 = await convertToBase64(uri)

            if (type === 'Instagram') {
                await Share.shareSingle({
                    title: cook.cook_title,
                    url: `data:image/jpeg;base64,${base64}`,
                    type: 'image/jpeg',
                    social: Share.Social.INSTAGRAM
                })
            } else {
                const filePath = `${RNFS.CachesDirectoryPath}/temp_image.jpg`;
                await RNFS.writeFile(filePath, base64, 'base64');
                console.log(filePath)

                const shareContent = {
                    contentType: 'photo',
                    photos: [{ imageUrl: `file://${filePath}` }],
                };

                // const result = await LoginManager.logInWithPermissions([])
                // if (!result.isCancelled) {
                //     console.log(result.grantedPermissions.toString())
                // }

                const canShow = await ShareDialog.canShow(shareContent)
                if (canShow) {
                    await ShareDialog.show(shareContent);
                }
            }
            onClose()
            setLoading(false)
        } catch (error) {
            console.log(error)
            console.log(JSON.stringify(error))
            onClose()
            setLoading(false)
        }
    }
    const requestStoragePermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'Storage Permission Required',
                        message: 'This app needs access to your storage to share the photos',
                    }
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        } else {
            return true;
        }
    };
    return (
        <Modal transparent >
            <View style={{ flex: 1, backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.OVERLAY : THEME.DARK_COLOR.OVERLAY, alignItems: 'center', justifyContent: 'center' }} >
                <View style={{ width: Constants.LAYOUT.SCREEN_WIDTH - 50, backgroundColor: theme === 'light' ? THEME.LIGHT_COLOR.BACKGROUND_100 : THEME.DARK_COLOR.BACKGROUND_100, paddingTop: 20, paddingBottom: 25, borderRadius: 24, paddingHorizontal: 25 }}>
                    <Text style={{ textAlign: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_SEMIBOLD, fontSize: Constants.FONT_SIZE.FT20, color: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_100 : THEME.DARK_COLOR.TEXT_100 }}>
                        {"Post My Cook To"}
                    </Text>
                    <View style={{ marginTop: 20 }}>
                        <Text style={{ color: theme === 'light' ? THEME.LIGHT_COLOR.TEXT_100 : THEME.DARK_COLOR.TEXT_100, fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT15 }}>
                            {`Select Photos`}
                        </Text>
                        <View style={{ height: 75, marginTop: 10 }}>
                            <ScrollView horizontal style={{ width: Constants.LAYOUT.SCREEN_WIDTH - 100 }}>
                                {photos.map((photo, index) => <PhotoItem key={index.toString()} index={index} photo={photo} />)}
                            </ScrollView>
                        </View>
                    </View>
                    <TouchableOpacity onPress={onClose} style={{ position: 'absolute', top: 15, right: 15, width: 25, height: 25, borderRadius: 30, borderWidth: 1, borderColor: theme === 'light' ? THEME.LIGHT_COLOR.DESTRUCTIVE : THEME.DARK_COLOR.DESTRUCTIVE, alignItems: 'center', justifyContent: 'center' }}>
                        <Image style={{ width: 16, height: 16, tintColor: theme === 'light' ? THEME.LIGHT_COLOR.DESTRUCTIVE : THEME.DARK_COLOR.DESTRUCTIVE }} source={require('../../assets/images/icon_close.png')} />
                    </TouchableOpacity>
                    {
                        type &&
                        <ViewShot
                            ref={canvasRef}
                            options={{ format: 'jpg', quality: 0.4 }}
                            style={{
                                position: 'absolute',
                                left: -2000,
                                top: -2000,
                            }} >
                            <View
                                style={{
                                    width: Constants.LAYOUT.SCREEN_WIDTH * 0.75,
                                    height: Constants.LAYOUT.SCREEN_WIDTH * 0.75,
                                    // height: type === 'Instagram' ? Constants.LAYOUT.SCREEN_WIDTH * 0.75 :
                                    // type === 'Facebook' ? Constants.LAYOUT.SCREEN_WIDTH * 0.75 / 1.91 : 0
                                }} >
                                <FastImage
                                    source={{ uri: photos[selectedIndex], priority: FastImage.priority.high }}
                                    style={{ position: 'absolute', width: '100%', height: '100%' }}
                                    resizeMode={FastImage.resizeMode.cover} />
                                <View style={{ width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.2)' }} />
                                <FastImage
                                    source={require('../../assets/images/img_logo_white.png')}
                                    style={{
                                        opacity: OVERLAY_OPACITY,
                                        position: 'absolute',
                                        right: 15,
                                        top: 18,
                                        width: Constants.LAYOUT.SCREEN_WIDTH * 0.2,
                                        height: Constants.LAYOUT.SCREEN_WIDTH * 0.2 * 687 / 512
                                    }} />
                                {
                                    <View style={{ opacity: OVERLAY_OPACITY, position: 'absolute', top: 15, left: 15 }}>
                                        <Text style={{ color: theme === 'light' ? THEME.LIGHT_COLOR.WHITE : THEME.DARK_COLOR.WHITE, fontFamily: Constants.FONT_FAMILY.PRIMARY_SEMIBOLD, fontSize: Constants.FONT_SIZE.FT16 }}>
                                            {`Appearance: ${cook.meat_ratings.appearance}`}
                                        </Text>
                                        <Text style={{ color: theme === 'light' ? THEME.LIGHT_COLOR.WHITE : THEME.DARK_COLOR.WHITE, fontFamily: Constants.FONT_FAMILY.PRIMARY_SEMIBOLD, fontSize: Constants.FONT_SIZE.FT16 }}>
                                            {`Taste: ${cook.meat_ratings.taste}`}
                                        </Text>
                                        <Text style={{ color: theme === 'light' ? THEME.LIGHT_COLOR.WHITE : THEME.DARK_COLOR.WHITE, fontFamily: Constants.FONT_FAMILY.PRIMARY_SEMIBOLD, fontSize: Constants.FONT_SIZE.FT16 }}>
                                            {`Tenderness: ${cook.meat_ratings.tenderness}`}
                                        </Text>
                                        <Text style={{ color: theme === 'light' ? THEME.LIGHT_COLOR.WHITE : THEME.DARK_COLOR.WHITE, fontFamily: Constants.FONT_FAMILY.PRIMARY_SEMIBOLD, fontSize: Constants.FONT_SIZE.FT16 }}>
                                            {`Overall: ${cook.meat_ratings.overal_rating}`}
                                        </Text>
                                    </View>
                                }
                            </View>
                        </ViewShot>
                    }
                    <View style={{ marginTop: 35, flexDirection: 'row', alignSelf: 'center' }}>
                        <SocialButton
                            icon={require('../../assets/images/icon_facebook.png')}
                            label={"Facebook"}
                            containerStyle={{}}
                            textStyle={{}}
                            onPress={onFacebookPress} />
                        <SocialButton
                            icon={require('../../assets/images/icon_instagram.png')}
                            label={"Instagram"}
                            containerStyle={{ marginLeft: 20 }}
                            textStyle={{}}
                            onPress={onInstagramPress} />
                        {/* <SocialButton
                            icon={require('../../assets/images/icon_tiktok.png')}
                            label={"TikTok"}
                            containerStyle={{ marginLeft: 20 }}
                            textStyle={{}} /> */}
                    </View>
                </View>
            </View>
            <Spinner visible={loading} />
        </Modal>
    )
}

export default ShareModal;