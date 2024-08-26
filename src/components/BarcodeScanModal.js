// import React in our code
import React, { useEffect, useState } from "react";

// import all the components we are going to use
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  Alert,
  Platform,
  TouchableHighlight,
  Modal,
  StatusBar,
} from "react-native";

// import CameraScreen
import CameraKit, {
  Camera,
  CameraApi,
  CameraScreen,
  CameraType,
} from "react-native-camera-kit";
import StyledBackButton from "./StyledBackButton";
import Constants from "../common/Constants";
import THEME from "../common/Theme";
import { useThemeContext } from "../contexts/ThemeContext";

const BarcodeScanModal = ({ visible, type, onClose, onBarcodeScanned }) => {
  if (!visible) {
    return null;
  }
  const { theme } = useThemeContext();
  const [isPermitted, setIsPermitted] = useState(false);
  const [captureImages, setCaptureImages] = useState([]);
  const [doScanBarcode, setDoScanBarcode] = useState(true); //add this state

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

  useEffect(() => {
    openCamera();
  }, []);

  const openCamera = async () => {
    if (Platform.OS === "android") {
      if (await requestCameraPermission()) {
        // if (await requestExternalWritePermission()) {
        // if (await requestExternalReadPermission()) {
        setIsPermitted(true);
        // } else alert("READ_EXTERNAL_STORAGE permission denied");
        // } else alert("WRITE_EXTERNAL_STORAGE permission denied");
      } else Alert.alert("CAMERA permission denied");
    } else {
      setIsPermitted(true);
    }
  };

  const onBottomButtonPressed = (event) => {
    const images = JSON.stringify(event.captureImages);
    if (event.type === "left") {
      setIsPermitted(false);
      onClose();
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

  const onBackPress = () => {
    onClose();
  };

  const handleScannedCallback = (event) => {
    const qrCodeValue = event.nativeEvent.codeStringValue;
    Alert.alert("QR code found. ", `QR code : ${qrCodeValue}`);
    if (qrCodeValue) onBarcodeScanned(qrCodeValue);
  };
  return (
    <Modal style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
          barStyle={Platform.OS == "ios" ? "white-content" : "light-content"}
        />
        {isPermitted ? (
          <View style={{ flex: 1 }}>
            <CameraScreen
              // Buttons to perform action done and cancel
              actions={{
                rightButtonText: "Done",
                leftButtonText: "Cancel",
              }}
              scanBarcode={true}
              onReadCode={handleScannedCallback} // optional
              showFrame={true} // (default false) optional, show frame with transparent layer (qr code or barcode will be read on this area ONLY), start animation for scanner,that stoped when find any code. Frame always at center of the screen
              laserColor="red" // (default red) optional, color of laser in scanner frame
              frameColor="white" // (default white) optional, color of border of scanner frame
              onBottomButtonPressed={(event) => onBottomButtonPressed(event)}
              flashImages={{
                // Flash button images
                on: require("../../assets/images/icon_flash.png"),
                off: require("../../assets/images/icon_flash_off.png"),
                auto: require("../../assets/images/icon_invisible.png"),
              }}
              cameraFlipImage={require("../../assets/images/icon_wind.png")}
              captureButtonImage={require("../../assets/images/icon_start.png")}
            />
          </View>
        ) : (
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
            <StyledBackButton
              containerStyle={{
                position: "absolute",
                left: 25,
                top: (Constants.LAYOUT.HEADER_HEIGHT - 24) / 2,
              }}
              imageStyle={{
                tintColor:
                  theme === "dark"
                    ? THEME.LIGHT_COLOR.WHITE
                    : THEME.DARK_COLOR.WHITE,
              }}
              onPress={onBackPress}
            />
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
