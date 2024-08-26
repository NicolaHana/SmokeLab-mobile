import React, { useEffect, useState } from "react";
import {
  Image,
  View,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  PermissionsAndroid,
} from "react-native";
import Constants from "../common/Constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import StyledIconButton from "../components/StyledIconButton";
import LinearGradient from "react-native-linear-gradient";
import { getLoggedInUser, presentAlertMessage } from "../common/Functions";
import Spinner from "../components/Spinner";
import StyledActionSheet from "../components/StyledActionSheet";
import Geolocation from "@react-native-community/geolocation";
import THEME from "../common/Theme";
import BannerAdsView from "../components/BannerAdsView";
import analytics from "@react-native-firebase/analytics";
import firebase from "@react-native-firebase/app";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore/lite";
import { useAuthContext } from "../contexts/AuthContext";
import Orientation from "react-native-orientation-locker";
import FastImage from "react-native-fast-image";
import moment from "moment";
import { useThemeContext } from "../contexts/ThemeContext";
import { AppEventsLogger, Settings } from "react-native-fbsdk-next";

const firebaseConfig = {
  apiKey: "AIzaSyCGaWN7LMY8OkKNmkXRxnF5XKdiugeLlv0",
  authDomain: "smokelab-913bd.firebaseapp.com",
  projectId: "smokelab-913bd",
  storageBucket: "smokelab-913bd.appspot.com",
  messagingSenderId: "495545544239",
  appId: "1:495545544239:web:34bb2e90e4ef97047120da",
  measurementId: "G-00JNT3495S",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

function HomScreen({ navigation }) {
  const { theme } = useThemeContext();
  const { loggedInUser, sessionUpdate } = useAuthContext();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [visibleDiscardPicker, setVisibleDiscardPicker] = useState(false);
  const [lastCookId, setLastCookId] = useState(null);
  const auth = getAuth();
  const firestore = getFirestore();

  useEffect(() => {
    Settings.setAdvertiserIDCollectionEnabled(true);
    Settings.setAdvertiserTrackingEnabled(true);
    Settings.setAutoLogAppEventsEnabled(true);
  }, []);

  useEffect(() => {
    Orientation.lockToPortrait();
    return () => {};
  }, []);
  useEffect(() => {
    getCurrentLocation();
    return () => {};
  }, []);
  useEffect(() => {
    setLastCookId(loggedInUser.last_cook_id);
    return () => {};
  }, [loggedInUser]);
  const getCurrentLocation = async () => {
    try {
      let granted;
      if (Platform.OS === "android") {
        granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Access Permission",
            message:
              "This app uses your location to get the weather informations.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        if (granted === "granted") {
          console.log("location:", `${granted} ${Platform.OS}`);
          Geolocation.requestAuthorization();
          Geolocation.getCurrentPosition(
            (position) => {
              global.location = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              };
            },
            (error) => {
              console.log("getCurrentPosition:", error);
            },
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 1000 }
          );
        }
      } else {
        Geolocation.requestAuthorization();
        Geolocation.getCurrentPosition(
          (position) => {
            global.location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
          },
          (error) => {
            console.log("getCurrentPosition:", error);
          },
          { enableHighAccuracy: true, timeout: 2000, maximumAge: 1000 }
        );
      }
    } catch (error) {
      console.log("getCurrentLocation:", error);
    }
  };
  const onSettingsPress = () => {
    // throw new Error('My first Sentry error!');
    // Sentry.nativeCrash();
    navigation.navigate("TabSettings");
  };
  const onStartNewPress = async () => {
    if (lastCookId) {
      setVisibleDiscardPicker(true);
    } else {
      try {
        setLoading(true);
        const availableToAdd = await checkAvailableToAdd();

        if (availableToAdd) {
          const cookId = await createCook();

          setLastCookId(cookId);
          setLoading(false);
          setTimeout(() => {
            navigation.push("Preparation", { id: cookId });
          }, 100);
        } else {
          setLoading(false);
          setTimeout(() => {
            presentAlertMessage({
              title: `You can only create ${
                loggedInUser.purchase_count ? loggedInUser.purchase_count : 5
              } cooks. If you want to create more, please subscribe on profile page or delete old ones on search page.`,
            });
          }, 100);
        }
      } catch (error) {
        console.log("checkAvailableToAdd:", error);
        setLoading(false);
        setTimeout(() => {
          presentAlertMessage({
            title: "Some problems occurred, please try again.",
          });
        }, 100);
      }
    }
  };
  const deleteCook = async (id) => {
    try {
      setVisibleDiscardPicker(false);
      setLoading(true);

      await deleteDoc(doc(collection(firestore, "live_cooks"), id));
      await updateDoc(
        doc(collection(firestore, "live_users"), auth.currentUser.uid),
        {
          last_cook_id: deleteField(),
        }
      );
      sessionUpdate(await getLoggedInUser());

      const cookId = await createCook();

      setLastCookId(cookId);
      setLoading(false);
      setTimeout(() => {
        navigation.push("Preparation", { id: cookId });
      }, 100);
    } catch (error) {
      console.log("deleteCook:", error);
      setLoading(false);
    }
  };
  const createCook = async () => {
    try {
      const cookReference = await addDoc(
        collection(firestore, "live_cooks"),
        {}
      );
      await updateDoc(
        doc(collection(firestore, "live_cooks"), cookReference.id),
        {
          cook_id: cookReference.id,
          document_id: cookReference.id,
          cook_date: moment().valueOf(),
          meat_weight_unit: "lbs",
          meat_weight_unit1: "oz",
          is_active: false,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        }
      );
      await updateDoc(
        doc(collection(firestore, "live_users"), auth.currentUser.uid),
        {
          last_cook_id: cookReference.id,
        }
      );
      sessionUpdate(await getLoggedInUser());

      return cookReference.id;
    } catch (error) {
      console.log("createCook:", error);
    }
  };
  const checkAvailableToAdd = async () => {
    if (loggedInUser.is_unlimited) {
      return true;
    }
    try {
      const cooksQuery = query(
        collection(firestore, "live_cooks"),
        where("user_id", "==", auth.currentUser.uid),
        where("is_active", "==", true)
      );
      const querySnapshot = await getDocs(cooksQuery);
      const purchaseCount = loggedInUser.purchase_count
        ? loggedInUser.purchase_count
        : 5;

      return purchaseCount > querySnapshot.docs.length;
    } catch (error) {
      throw error;
    }
  };
  const onResumePress = async () => {
    // Send Analytics Event
    const appInstanceId = await analytics().getSessionId();
    console.log("firebase.onLoginButtonPress", appInstanceId);
    await analytics().logEvent("app_login", {
      name: "app_login",
      description: "firebase-function",
    });
    try {
      const response = await fetch(
        "https://us-central1-smokelab-913bd.cloudfunctions.net/onAppLogin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user: "Loggined user Alex" }),
        }
      );
      console.log("Response", response);
      if (!response) {
        throw new Error("Failed to fetch logined data.");
      }
    } catch (e) {
      console.error("Access to firebase function error!", error);
    }
    console.log("logEvent Success");
    navigation.push("Preparation", { id: lastCookId });
  };
  const onSearchPress = () => {
    navigation.navigate("TabLibrary");
  };
  const HeaderView = () => {
    return (
      <View
        style={{
          marginTop: insets.top + 15,
          width: Constants.LAYOUT.SCREEN_WIDTH,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 25,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <FastImage
            resizeMode={FastImage.resizeMode.contain}
            style={{ marginLeft: 0, width: (30 * 521) / 86, height: 30 }}
            source={require("../../assets/images/img_logo_text.png")}
          />
        </View>
        <StyledIconButton
          containerStyle={{ borderRadius: 40, position: "absolute", right: 75 }}
          icon={require("../../assets/images/icon_search.png")}
          onPress={onSearchPress}
        />
        <StyledIconButton
          containerStyle={{ borderRadius: 40, position: "absolute", right: 25 }}
          icon={require("../../assets/images/icon_settings.png")}
          onPress={onSettingsPress}
        />
      </View>
    );
  };
  const MenuButton = ({
    enabled,
    title,
    icon,
    containerStyle,
    textStyle,
    onPress,
  }) => {
    return (
      <LinearGradient
        colors={[
          enabled
            ? theme === "light"
              ? THEME.LIGHT_COLOR.GRAIDENT_LIGHT
              : THEME.DARK_COLOR.GRAIDENT_LIGHT
            : theme === "light"
            ? THEME.LIGHT_COLOR.TEXT_300
            : THEME.DARK_COLOR.TEXT_300,
          enabled
            ? theme === "light"
              ? THEME.LIGHT_COLOR.GRAIDENT_DARK
              : THEME.DARK_COLOR.GRAIDENT_DARK
            : theme === "light"
            ? THEME.LIGHT_COLOR.TEXT_300
            : THEME.DARK_COLOR.TEXT_300,
        ]}
        style={[
          {
            width: Constants.LAYOUT.SCREEN_WIDTH - 60,
            height: 120,
            borderRadius: 16,
          },
          containerStyle,
        ]}
      >
        <TouchableOpacity
          activeOpacity={enabled ? 0.2 : 1}
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
          }}
          onPress={() => {
            enabled && onPress();
          }}
        >
          <Image
            style={{
              width: 48,
              height: 48,
              tintColor:
                theme === "light"
                  ? THEME.LIGHT_COLOR.WHITE
                  : THEME.DARK_COLOR.WHITE,
            }}
            source={icon}
          />
          <Text
            style={[
              {
                marginTop: 5,
                fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD,
                fontSize: Constants.FONT_SIZE.FT24,
                color:
                  theme === "light"
                    ? THEME.LIGHT_COLOR.WHITE
                    : THEME.DARK_COLOR.WHITE,
                textAlign: "center",
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    );
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
      <StyledActionSheet
        visible={visibleDiscardPicker}
        title={"Discard old cook?"}
        content={"Are you sure you want to discard old cook?"}
        cancel={"Cancel"}
        options={["Discard"]}
        onCancelPress={() => {
          setVisibleDiscardPicker(false);
        }}
        onOptionPress={(index) => {
          deleteCook(lastCookId);
        }}
      />
      <FastImage
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
      <HeaderView />
      <Text
        style={{
          marginLeft: 25,
          marginTop: 5,
          fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM,
          fontSize: Constants.FONT_SIZE.FT18,
          color:
            theme === "light"
              ? THEME.LIGHT_COLOR.TEXT_300
              : THEME.DARK_COLOR.TEXT_300,
        }}
      >
        {"Smoke. Journal. Repeat"}
      </Text>
      <Image
        style={{
          opacity: 0.2,
          bottom: insets.bottom + 25,
          position: "absolute",
          alignSelf: "center",
          tintColor:
            theme === "light"
              ? THEME.LIGHT_COLOR.TEXT_300
              : THEME.DARK_COLOR.TEXT_300,
          width: Constants.LAYOUT.SCREEN_WIDTH / 3,
          height: Constants.LAYOUT.SCREEN_WIDTH / 3,
          resizeMode: "contain",
        }}
        source={require("../../assets/images/img_logo_no_text.png")}
      />
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: insets.bottom + 50,
        }}
      >
        <MenuButton
          containerStyle={{ width: Constants.LAYOUT.SCREEN_WIDTH - 50 }}
          enabled={true}
          title={"Start A New Cook"}
          icon={require("../../assets/images/icon_start.png")}
          onPress={onStartNewPress}
        />
        <MenuButton
          containerStyle={{
            marginTop: 20,
            width: Constants.LAYOUT.SCREEN_WIDTH - 50,
          }}
          enabled={lastCookId}
          title={"Resume My Cook"}
          icon={require("../../assets/images/icon_resume.png")}
          onPress={onResumePress}
        />
        <MenuButton
          containerStyle={{
            marginTop: 20,
            width: Constants.LAYOUT.SCREEN_WIDTH - 50,
          }}
          enabled={true}
          title={"My Library"}
          icon={require("../../assets/images/icon_library.png")}
          onPress={onSearchPress}
        />
      </View>
      {!loggedInUser.is_unlimited && (
        <BannerAdsView
          onAdLoaded={() => {
            Settings.setAppID("1091859595411123");
            // Settings.setAppID('2019743915086758');
            Settings.initializeSDK();
            AppEventsLogger.logEvent("AD_CLICKED", {
              [AppEventsLogger.AppEventParams.RegistrationMethod]: "email",
            });
            AppEventsLogger.flush();
            console.log("onAdLoaded");
          }}
          onAdFailedToLoad={(e) => {
            console.log("onAdFailedToLoad", e);
          }}
        />
      )}
      <Spinner visible={loading} />
    </View>
  );
}

export default HomScreen;
