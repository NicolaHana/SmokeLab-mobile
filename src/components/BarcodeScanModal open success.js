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
  SafeAreaView,
  TouchableHighlight,
} from "react-native";
import THEME from "../common/Theme";
// import { Camera, useCameraDevice, useCodeScanner } from "react-native-vision-camera";
import CameraKit, {
  Camera,
  CameraScreen,
  CameraType,
  CameraApi,
} from "react-native-camera-kit";
import StyledBackButton from "./StyledBackButton";
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
  const [isPermitted, setIsPermitted] = useState(false);
  const [captureImages, setCaptureImages] = useState([]);

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Camera Permission",
          message: "App needs camera permission",
        }
      );
      // If CAMERA Permission is granted
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const requestExternalWritePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "External Storage Write Permission",
          message: "App needs write permission",
        }
      );
      // If WRITE_EXTERNAL_STORAGE Permission is granted
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      alert("Write permission err", err);
    }
    return false;
  };

  const requestExternalReadPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: "Read Storage Permission",
          message: "App needs Read Storage Permission",
        }
      );
      // If READ_EXTERNAL_STORAGE Permission is granted
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      alert("Read permission err", err);
    }
    return false;
  };

  const openCamera = async () => {
    if (Platform.OS === "android") {
      if (await requestCameraPermission()) {
        if (await requestExternalWritePermission()) {
          if (await requestExternalReadPermission()) {
            setIsPermitted(true);
          } else alert("READ_EXTERNAL_STORAGE permission denied");
        } else alert("WRITE_EXTERNAL_STORAGE permission denied");
      } else alert("CAMERA permission denied");
    } else {
      setIsPermitted(true);
    }
  };

  const onBottomButtonPressed = (event) => {
    const images = JSON.stringify(event.captureImages);
    if (event.type === "left") {
      setIsPermitted(false);
    } else if (event.type === "right") {
      setIsPermitted(false);
      setCaptureImages(images);
    } else {
      Alert.alert(
        event.type,
        images,
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
    }
  };
  return (
    <Modal style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        {isPermitted ? (
          <View style={{ flex: 1 }}>
            <CameraScreen
              // Buttons to perform action done and cancel
              actions={{
                rightButtonText: "Done",
                leftButtonText: "Cancel",
              }}
              onBottomButtonPressed={(event) => onBottomButtonPressed(event)}
              flashImages={{
                // Flash button images
                on: require("../../assets/images/icon_flash.png"),
                off: require("../../assets/images/icon_flash_off.png"),
                auto: require("../../assets/images/icon_flash.png"),
              }}
              cameraFlipImage={require("../../assets/images/icon_flash.png")}
              captureButtonImage={require("../../assets/images/icon_flash.png")}
            />
          </View>
        ) : (
          <View style={styles.container}>
            <Text style={styles.titleText}>Scan QR Code Please.</Text>
            <Text style={styles.textStyle}>{captureImages}</Text>
            <TouchableHighlight onPress={openCamera} style={styles.buttonStyle}>
              <Text style={styles.buttonTextStyle}>Open Camera</Text>
            </TouchableHighlight>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

export default BarcodeScanModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
    alignItems: "center",
  },
  titleText: {
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold",
  },
  textStyle: {
    color: "black",
    fontSize: 16,
    textAlign: "center",
    padding: 10,
    marginTop: 16,
  },
  buttonStyle: {
    fontSize: 16,
    color: "white",
    backgroundColor: "green",
    padding: 5,
    marginTop: 32,
    minWidth: 250,
  },
  buttonTextStyle: {
    padding: 5,
    color: "white",
    textAlign: "center",
  },
});
