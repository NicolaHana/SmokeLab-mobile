import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  View,
  Platform,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  LayoutAnimation,
} from "react-native";
import Constants from "../common/Constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import StyledButton from "../components/StyledButton";
import StyledTextInput from "../components/StyledTextInput";
import Spinner from "../components/Spinner";
import StyledHeaderTitle from "../components/StyledHeaderTitle";
import StyledBackButton from "../components/StyledBackButton";
import THEME from "../common/Theme";
import StyledDateInput from "../components/StyledDateInput";
import StyledImagePicker from "../components/StyledImagePicker";
import {
  getLoggedInUser,
  presentAlertMessage,
  uploadFileToStorage,
} from "../common/Functions";
import moment from "moment";
import { getAuth, updateProfile } from "firebase/auth";
import {
  getFirestore,
  doc,
  collection,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore/lite";
import FastImage from "react-native-fast-image";
import { useAuthContext } from "../contexts/AuthContext";
import { useThemeContext } from "../contexts/ThemeContext";

function EditProfileScreen({ navigation }) {
  const { theme } = useThemeContext();
  const { loggedInUser, sessionUpdate } = useAuthContext();
  const insets = useSafeAreaInsets();
  const auth = getAuth();
  const firestore = getFirestore();
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(
    loggedInUser ? loggedInUser.user_photo : ""
  );
  const [name, setName] = useState(loggedInUser ? loggedInUser.user_name : "");
  const [email, setEmail] = useState(auth.currentUser.email);
  const [city, setCity] = useState(loggedInUser ? loggedInUser.user_city : "");
  const [dateOfBirth, setDateOfBirth] = useState(
    loggedInUser
      ? moment(new Date(loggedInUser.user_birth_date.seconds * 1000)).format(
          "YYYY-MM-DD"
        )
      : ""
  );
  const [smoker, setSmoker] = useState(
    loggedInUser ? loggedInUser.user_smoker_grill : ""
  );
  const [thermometer, setThermometer] = useState(
    loggedInUser ? loggedInUser.user_thermometer : ""
  );
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const imagePickerRef = useRef();
  const nameTextInputRef = useRef();
  const emailTextInputRef = useRef();
  const cityTextInputRef = useRef();
  const smokerTextInputRef = useRef();
  const thermometerTextInputRef = useRef();
  const contentScrollViewRef = useRef();
  useEffect(() => {
    setEmail(auth.currentUser.email);
    return () => {};
  }, [loggedInUser]);
  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      Platform.OS == "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (event) => keyboardDidShow(event)
    );
    const hideSubscription = Keyboard.addListener(
      Platform.OS == "ios" ? "keyboardWillHide" : "keyboardDidHide",
      (event) => keyboardDidHide(event)
    );
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  const keyboardDidShow = (event) => {
    let height = event.endCoordinates.height;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setKeyboardHeight(Platform.OS === "ios" ? height : 0);
  };
  const keyboardDidHide = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setKeyboardHeight(0);
  };
  const onUpdatePress = () => {
    console.log("update pressed");
    if (name === "") return;
    if (city === "") return;
    if (dateOfBirth === "") return;
    if (smoker === "") return;
    if (thermometer === "") return;

    updateUserProfile();
  };
  const onPhotoPress = () => {
    imagePickerRef.current.present();
  };

  const updateUserProfile = async () => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      let userPhotoURL = "";
      if (photo.path) {
        userPhotoURL = await uploadFileToStorage(
          `live_user_photos/${auth.currentUser.uid}/profile.jpg`,
          photo.path
        );
      } else {
        userPhotoURL = photo;
      }

      await updateDoc(
        doc(collection(firestore, "live_users"), auth.currentUser.uid),
        {
          user_name: name,
          user_birth_date: moment(dateOfBirth).toDate(),
          user_city: city,
          user_photo: userPhotoURL,
          user_smoker_grill: smoker,
          user_thermometer: thermometer,
          updated_at: serverTimestamp(),

          user_username: name,
          user_screen_name: name,
        }
      );
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: userPhotoURL,
      });
      sessionUpdate(await getLoggedInUser());

      setLoading(false);
      setTimeout(() => {
        presentAlertMessage({
          title: "Your profile has been successfully updated.",
        });
      }, 100);
    } catch (error) {
      console.log("updateUserProfile:", error);
      setLoading(false);
      setTimeout(() => {
        presentAlertMessage({
          title: "Some problems occurred, please try again.",
        });
      }, 100);
    }
  };
  const updateUserPhoto = async (photo) => {
    console.log("p", photo);
    Keyboard.dismiss();

    try {
      setLoading(true);
      const userPhotoURL = await uploadFileToStorage(
        `live_user_photos/${auth.currentUser.uid}/profile.jpg`,
        photo.path
      );

      await updateDoc(
        doc(collection(firestore, "live_users"), auth.currentUser.uid),
        {
          user_photo: userPhotoURL,
          updated_at: serverTimestamp(),
        }
      );
      await updateProfile(auth.currentUser, { photoURL: userPhotoURL });
      sessionUpdate(await getLoggedInUser());
      setPhoto(loggedInUser.user_photo);

      setLoading(false);
      setTimeout(() => {
        presentAlertMessage({
          title: "Your profile photo has been successfully updated.",
        });
      }, 100);
    } catch (error) {
      console.log("updateUserPhoto:", error);
      setLoading(false);
      setTimeout(() => {
        presentAlertMessage({
          title: "Some problems occurred, please try again.",
        });
      }, 100);
    }
  };
  const onBackPress = () => {
    navigation.pop();
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor:
          theme === "light"
            ? THEME.LIGHT_COLOR.BACKGROUND_100
            : THEME.DARK_COLOR.BACKGROUND_100,
      }}
    >
      <StatusBar
        barStyle={
          Platform.OS == "ios"
            ? theme === "dark"
              ? "light-content"
              : "dark-content"
            : "light-content"
        }
        backgroundColor={
          theme === "light" ? THEME.LIGHT_COLOR.BLACK : THEME.DARK_COLOR.BLACK
        }
      />
      <StyledImagePicker
        ref={imagePickerRef}
        title={null}
        multiple={false}
        onImagesPicked={(photos) => {
          updateUserPhoto(photos[0]);
          // setPhoto(photos[0])
        }}
      />
      <FastImage
        defaultSource={require("../../assets/images/img_user_placeholder.png")}
        resizeMode={FastImage.resizeMode.cover}
        style={{
          opacity: 0.2,
          position: "absolute",
          top: 0,
          width: Constants.LAYOUT.SCREEN_WIDTH,
          height: (Constants.LAYOUT.SCREEN_WIDTH * 1080 * 2) / 1920,
        }}
        source={require("../../assets/images/img_smoke1.png")}
      />
      <View
        style={{
          marginTop: insets.top,
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
          onPress={onBackPress}
        />
        <StyledHeaderTitle
          title={"Edit Profile"}
          containerStyle={{ alignSelf: "center" }}
        />
      </View>
      <ScrollView
        ref={contentScrollViewRef}
        tyle={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 25, paddingBottom: 25 }}
      >
        <TouchableOpacity
          onPress={onPhotoPress}
          style={{ alignSelf: "center", marginTop: 20 }}
        >
          <FastImage
            resizeMode={FastImage.resizeMode.cover}
            style={{ width: 96, height: 96, borderRadius: 30 }}
            defaultSource={require("../../assets/images/img_user_placeholder.png")}
            // source={photo === '' ? require('../../assets/images/img_user_placeholder.png') : { uri: photo.path ? photo.path : photo }}
            source={{ uri: auth.currentUser.photoURL }}
          />
          <TouchableOpacity
            onPress={onPhotoPress}
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              backgroundColor:
                theme === "light"
                  ? THEME.LIGHT_COLOR.PRIMARY
                  : THEME.DARK_COLOR.PRIMARY,
              position: "absolute",
              right: -10,
              bottom: -10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              style={{
                height: 16,
                width: 16,
                tintColor:
                  theme === "light"
                    ? THEME.LIGHT_COLOR.WHITE
                    : THEME.DARK_COLOR.WHITE,
              }}
              source={require("../../assets/images/icon_edit.png")}
            />
          </TouchableOpacity>
        </TouchableOpacity>
        <StyledTextInput
          ref={nameTextInputRef}
          containerStyle={{ marginTop: 45 }}
          placeholder={""}
          initialValue={name}
          autoCapitalize={"words"}
          keyboardType={"default"}
          returnKeyType={"next"}
          onFocus={() => {
            setTimeout(() => {
              contentScrollViewRef.current.scrollTo({ y: 136, animated: true });
            }, 500);
          }}
          onChangeValue={(value) => {
            setName(value);
          }}
          onSubmitEditing={() => {
            emailTextInputRef.current.focus();
          }}
          icon={require("../../assets/images/icon_user.png")}
          label={"Name"}
        />
        <StyledTextInput
          ref={emailTextInputRef}
          containerStyle={{ marginTop: 35 }}
          placeholder={""}
          editable={false}
          initialValue={email}
          autoCapitalize={"words"}
          keyboardType={"default"}
          returnKeyType={"next"}
          onFocus={() => {
            setTimeout(() => {
              contentScrollViewRef.current.scrollTo({
                y: 136 + 48 * 1 + 35 * 1,
                animated: true,
              });
            }, 500);
          }}
          onChangeValue={(value) => {
            setEmail(value);
          }}
          onSubmitEditing={() => {
            Keyboard.dismiss();
          }}
          onRightIconPress={() => {
            navigation.push("ChangeEmail");
          }}
          rightIcon={require("../../assets/images/icon_edit.png")}
          icon={require("../../assets/images/icon_email.png")}
          label={"Email Address"}
        />
        <StyledTextInput
          ref={cityTextInputRef}
          containerStyle={{ marginTop: 35 }}
          placeholder={""}
          initialValue={city}
          autoCapitalize={"words"}
          keyboardType={"default"}
          returnKeyType={"next"}
          onFocus={() => {
            setTimeout(() => {
              contentScrollViewRef.current.scrollTo({
                y: 136 + 48 * 2 + 35 * 2,
                animated: true,
              });
            }, 500);
          }}
          onChangeValue={(value) => {
            setCity(value);
          }}
          onSubmitEditing={() => {
            Keyboard.dismiss();
          }}
          icon={require("../../assets/images/icon_location.png")}
          label={"City, State"}
        />
        <StyledDateInput
          containerStyle={{ marginTop: 35 }}
          placeholder={""}
          initialValue={dateOfBirth}
          minimumDate={moment().add("-100", "years").toDate()}
          maximumDate={moment().toDate()}
          onChangeValue={(value) => {
            setDateOfBirth(value);
          }}
          onShown={() => {
            Keyboard.dismiss();
          }}
          icon={require("../../assets/images/icon_date.png")}
          label={"Date of Birth"}
        />
        <StyledTextInput
          ref={smokerTextInputRef}
          containerStyle={{ marginTop: 35, height: 120 }}
          placeholder={""}
          multiline={true}
          initialValue={smoker}
          autoCapitalize={"words"}
          keyboardType={"default"}
          returnKeyType={"done"}
          onFocus={() => {
            setTimeout(() => {
              contentScrollViewRef.current.scrollTo({
                y: 136 + 48 * 4 + 35 * 4,
                animated: true,
              });
            }, 500);
          }}
          onChangeValue={(value) => {
            setSmoker(value);
          }}
          onSubmitEditing={() => {
            thermometerTextInputRef.current.focus();
          }}
          icon={require("../../assets/images/icon_grill.png")}
          label={"Smoker/Grill"}
        />
        <StyledTextInput
          ref={thermometerTextInputRef}
          containerStyle={{ marginTop: 35, height: 120 }}
          placeholder={""}
          multiline={true}
          initialValue={thermometer}
          autoCapitalize={"words"}
          keyboardType={"default"}
          returnKeyType={"done"}
          onFocus={() => {
            setTimeout(() => {
              contentScrollViewRef.current.scrollTo({
                y: 136 + 48 * 5 + 35 * 5,
                animated: true,
              });
            }, 500);
          }}
          onChangeValue={(value) => {
            setThermometer(value);
          }}
          onSubmitEditing={() => {
            thermometerTextInputRef.current.focus();
          }}
          icon={require("../../assets/images/icon_thermometer.png")}
          label={"Thermometer"}
        />
      </ScrollView>
      <View
        style={{
          paddingBottom:
            keyboardHeight === 0 ? insets.bottom + 15 : keyboardHeight + 15,
          paddingTop: 15,
          backgroundColor:
            theme === "light"
              ? THEME.LIGHT_COLOR.BACKGROUND_100
              : THEME.DARK_COLOR.BACKGROUND_100,
          shadowColor:
            theme === "light"
              ? THEME.LIGHT_COLOR.SHADOW
              : THEME.DARK_COLOR.SHADOW,
          shadowOffset: {
            width: 0,
            height: -5,
          },
          shadowOpacity: 0.08,
          shadowRadius: 4.59,
          elevation: 5,
        }}
      >
        <StyledButton
          containerStyle={{
            alignSelf: "center",
            width: Constants.LAYOUT.SCREEN_WIDTH - 50,
          }}
          title={"Update"}
          onPress={onUpdatePress}
        />
      </View>
      <Spinner visible={loading} />
    </View>
  );
}

export default EditProfileScreen;
