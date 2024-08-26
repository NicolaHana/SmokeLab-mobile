import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Modal,
} from "react-native";
import THEME from "../common/Theme";
// import { Camera, useCameraDevice, useCodeScanner } from "react-native-vision-camera";
import CameraKit, {
  Camera,
  CameraScreen,
  CameraType,
  CameraApi,
} from "react-native-camera-kit";
import StyledBackButton from "../components/StyledBackButton";
import Constants from "../common/Constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { AppState } from "react-native";
import { useThemeContext } from "../contexts/ThemeContext";

const BarcodeScanModal = ({ visible, type, onClose, onBarcodeScanned }) => {
  if (!visible) {
    return null;
  }
  const { theme } = useThemeContext();
  const insets = useSafeAreaInsets();
  const [focused, setFocused] = useState(false);
  const [foreground, setForeground] = useState(true);
  const [torch, setTorch] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  console.log("~~~~~~~~~~~~Camera~~~~~~~~~~", Camera);
  console.log("~~~~~~~~~~~~CameraApi~~~~~~~~~~", CameraApi);
  console.log("~~~~~~~~~~~~CameraKit~~~~~~~~~~", CameraKit);
  console.log("~~~~~~~~~~~~CameraType~~~~~~~~~~", CameraType);
  console.log("~~~~~~~~~~~~CameraScreen~~~~~~~~~~", CameraScreen);
  // const device = useCameraDevice('back')
  // useEffect(() => {
  //     const getCodeScannerPermissions = async () => {
  //         const newCameraPermission = await Camera.requestCameraPermission();
  //         setHasPermission(newCameraPermission === 'granted');
  //     };
  //     getCodeScannerPermissions();
  // }, []);
  // const codeScanner = useCodeScanner({
  //     codeTypes: ['code-128', 'code-39', 'code-93', 'codabar', 'ean-13', 'ean-8', 'itf', 'upc-e', 'qr', 'pdf-417', 'aztec', 'data-matrix'],
  //     onCodeScanned: onCodeScanned,
  // })

  useEffect(() => {
    const onChange = (state) => {
      setForeground(state === "active");
    };
    const listener = AppState.addEventListener("change", onChange);
    return () => listener.remove();
  }, [setForeground]);
  useFocusEffect(
    React.useCallback(() => {
      setFocused(true);
      return () => {
        setFocused(false);
      };
    }, [focused])
  );
  //   const onCodeScanned = useCallback((codes) => {
  //     const value = codes[0]?.value;
  //     if (value) onBarcodeScanned(value);
  //   }, []);
  const onBackPress = () => {
    onClose();
  };
  const onFlashPress = () => {
    setTorch(!torch);
  };
  return (
    <Modal style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          backgroundColor:
            theme === "light"
              ? THEME.LIGHT_COLOR.BLACK
              : THEME.DARK_COLOR.BLACK,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <StatusBar
          barStyle={Platform.OS == "ios" ? "white-content" : "light-content"}
        />
        {hasPermission === null ? (
          <Text
            style={{
              color:
                theme === "light"
                  ? THEME.LIGHT_COLOR.WHITE
                  : THEME.DARK_COLOR.WHITE,
              fontSize: Constants.FONT_SIZE.FT16,
              fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR,
            }}
          >
            Requesting for camera permission
          </Text>
        ) : hasPermission === false || device === undefined ? (
          <Text
            style={{
              color:
                theme === "light"
                  ? THEME.LIGHT_COLOR.WHITE
                  : THEME.DARK_COLOR.WHITE,
              fontSize: Constants.FONT_SIZE.FT16,
              fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR,
            }}
          >
            No access to camera
          </Text>
        ) : (
          <View
            style={{
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Camera
              style={StyleSheet.absoluteFill}
              device={device}
              isActive={focused && foreground}
              codeScanner={codeScanner}
              frameProcessorFps={5}
              audio={false}
              torch={torch ? "on" : "off"}
              enableZoomGesture={true}
            />
            <Image
              source={require("../../assets/images/scan-code.png")}
              style={{
                width: Constants.LAYOUT.SCREEN_WIDTH / 2,
                height: Constants.LAYOUT.SCREEN_WIDTH / 2,
              }}
            />
            <Text
              style={{
                marginTop: 10,
                color:
                  theme === "light"
                    ? THEME.LIGHT_COLOR.WHITE
                    : THEME.DARK_COLOR.WHITE,
                fontSize: Constants.FONT_SIZE.FT16,
                fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR,
              }}
            >
              {`Scan UPC Code`}
            </Text>
          </View>
        )}
        <View
          style={{
            position: "absolute",
            top: insets.top,
            width: Constants.LAYOUT.SCREEN_WIDTH,
            height: Constants.LAYOUT.HEADER_HEIGHT,
            justifyContent: "center",
          }}
        >
          <StyledBackButton
            containerStyle={{
              position: "absolute",
              left: 25,
              top: (Constants.LAYOUT.HEADER_HEIGHT - 24) / 2,
            }}
            imageStyle={{
              tintColor:
                theme === "light"
                  ? THEME.LIGHT_COLOR.WHITE
                  : THEME.DARK_COLOR.WHITE,
            }}
            onPress={onBackPress}
          />
          <TouchableOpacity
            onPress={onFlashPress}
            style={{
              position: "absolute",
              right: 25,
              top: (Constants.LAYOUT.HEADER_HEIGHT - 24) / 2,
            }}
          >
            <Image
              style={{
                width: 24,
                height: 24,
                tintColor:
                  theme === "light"
                    ? THEME.LIGHT_COLOR.WHITE
                    : THEME.DARK_COLOR.WHITE,
              }}
              source={
                torch
                  ? require("../../assets/images/icon_flash.png")
                  : require("../../assets/images/icon_flash_off.png")
              }
            />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default BarcodeScanModal;
