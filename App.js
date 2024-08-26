import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import ToastConfig from "./src/common/ToastConfig";
import SplashScreen from "./src/screens/SplashScreen";
import axios from "axios";
import AuthScreen from "./src/screens/AuthScreen";
import HomScreen from "./src/screens/HomScreen";
import LogInScreen from "./src/screens/LogInScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
import CreateProfileScreen from "./src/screens/CreateProfileScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import EditProfileScreen from "./src/screens/EditProfileScreen";
import LibraryScreen from "./src/screens/LibraryScreen";
import CookScreen from "./src/screens/CookScreen";
import PreparationScreen from "./src/screens/PreparationScreen";
import CookingScreen from "./src/screens/CookingScreen";
import ResultScreen from "./src/screens/ResultScreen";
import MyCooksScreen from "./src/screens/MyCooksScreen";
import { LogBox, Platform, TextInput, Text } from "react-native";
import TermsScreen from "./src/screens/TermsScreen";
import PrivacyScreen from "./src/screens/PrivacyScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthProvider, useAuthContext } from "./src/contexts/AuthContext";
import ChangeEmailScreen from "./src/screens/ChangeEmailScreen";
import { initializeApp, getApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
} from "firebase/auth";
import Purchases from "react-native-purchases";
import { getActiveSubscription, getLoggedInUser } from "./src/common/Functions";
import {
  collection,
  doc,
  getFirestore,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore/lite";
import { LogLevel, OneSignal } from "react-native-onesignal";
import Constants from "./src/common/Constants";
import useInterstitialAdWithDelay from "./src/hooks/useInterstitialAdWithDelay";
import Geolocation from "@react-native-community/geolocation";
import { ThemeProvider, useThemeContext } from "./src/contexts/ThemeContext";
import { Settings } from "react-native-fbsdk-next";
import * as Sentry from "@sentry/react-native";
import { AdsProvider, useAdsContext } from "./src/contexts/AdsContext";

Sentry.init({
  dsn: "https://60cc7f75f1f67c12beb58f9b3db5a642@o432757.ingest.sentry.io/4506417055924224",
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
});

LogBox.ignoreLogs([
  "Sending `onAnimatedValueUpdate` with no listeners registered.",
]);

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

// keytool -list -v -keystore '/Volumes/Data/Task/Progressing/SmokeLabs/ReactNative/Smokelab/Smokelab/android/app/debug.keystore' -alias androiddebugkey -storepass android -keypass android
// keytool -list -v -keystore '/Volumes/Data/Task/Progressing/SmokeLabs/ReactNative/Smokelab/Smokelab/android/app/smokelab.keystore' -alias my-key-alias -storepass smokelab123 -keypass smokelab123

// Debug
// 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
// FA:C6:17:45:DC:09:03:78:6F:B9:ED:E6:2A:96:2B:39:9F:73:48:F0:BB:6F:89:9B:83:32:66:75:91:03:3B:9C
// Xo8WBi6jzSxKDVR4drqm84yr9iU=

// Relase
// 61:BF:5E:F0:4E:3D:24:D0:4B:D3:96:D3:04:BB:6D:D2:ED:AE:59:96
// 81:26:29:15:C2:F0:72:6F:BA:4A:63:62:0A:08:BC:08:BF:F8:4F:32:9B:42:94:43:4C:1A:75:3B:F9:C3:0A:2C
// Yb9e8E49JNBL05bTBLtt0u2uWZY=

// keytool -exportcert -alias androiddebugkey -keystore '/Volumes/Data/Task/Progressing/SmokeLabs/ReactNative/Smokelab/Smokelab/android/app/debug.keystore' | openssl sha1 -binary | openssl base64
// keytool -exportcert -alias my-key-alias -keystore '/Volumes/Data/Task/Progressing/SmokeLabs/ReactNative/Smokelab/Smokelab/android/app/smokelab.keystore' | openssl sha1 -binary | openssl base64

const firebaseConfig = {
  apiKey: "AIzaSyCGaWN7LMY8OkKNmkXRxnF5XKdiugeLlv0",
  authDomain: "smokelab-913bd.firebaseapp.com",
  projectId: "smokelab-913bd",
  storageBucket: "smokelab-913bd.appspot.com",
  messagingSenderId: "495545544239",
  appId: "1:495545544239:web:34bb2e90e4ef97047120da",
  measurementId: "G-00JNT3495S",
};

Geolocation.setRNConfiguration({
  skipPermissionRequests: true,
  authorizationLevel: "whenInUse",
  locationProvider: "auto",
});

Settings.setAppID("1083418192828938");

const createFirebaseApp = (config = {}) => {
  try {
    return getApp();
  } catch (error) {
    const app = initializeApp(config);
    initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
    return app;
  }
};
createFirebaseApp(firebaseConfig);

axios.defaults.timeout = 60000;

global.isFirstLaunch = true;
global.isFirstAd = true;

global.packages = [];
global.activeSubscription = null;

global.location = null;
global.weather = null;

function NavigatorAuth() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      initialRouteName={global.isFirstLaunch ? "Auth" : "LogIn"}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="Auth"
        component={AuthScreen}
        options={{ animationEnabled: false }}
      />
      <Stack.Screen name="LogIn" component={LogInScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="CreateProfile" component={CreateProfileScreen} />
      <Stack.Screen name="Terms" component={TermsScreen} />
      <Stack.Screen name="Privacy" component={PrivacyScreen} />
    </Stack.Navigator>
  );
}

function TabHome() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      initialRouteName={"Home"}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={HomScreen} />
      <Stack.Screen name="Preparation" component={PreparationScreen} />
      <Stack.Screen name="Cooking" component={CookingScreen} />
      <Stack.Screen name="Result" component={ResultScreen} />
      <Stack.Screen name="Cook" component={CookScreen} />
    </Stack.Navigator>
  );
}

function TabLibrary() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      initialRouteName={"Library"}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Library" component={LibraryScreen} options={{}} />
      <Stack.Screen name="MyCooks" component={MyCooksScreen} options={{}} />
      <Stack.Screen name="Cook" component={CookScreen} />
      <Stack.Screen name="Preparation" component={PreparationScreen} />
      <Stack.Screen name="Cooking" component={CookingScreen} />
      <Stack.Screen name="Result" component={ResultScreen} />
    </Stack.Navigator>
  );
}

function TabSettings() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      initialRouteName={"Messages"}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ChangeEmail" component={ChangeEmailScreen} />
      <Stack.Screen name="Terms" component={TermsScreen} />
      <Stack.Screen name="Privacy" component={PrivacyScreen} />
    </Stack.Navigator>
  );
}

function NavigatorTab() {
  const Stack = createBottomTabNavigator();
  const auth = getAuth();
  const firestore = getFirestore();
  const { sessionUpdate } = useAuthContext();
  useEffect(() => {
    logInToRevenueCat();
    return () => {};
  }, []);
  async function logInToRevenueCat() {
    if (auth.currentUser) {
      const { customerInfo } = await Purchases.logIn(auth.currentUser.uid);
      global.activeSubscription = getActiveSubscription(customerInfo);
    } else {
      const customerInfo = await Purchases.getCustomerInfo();
      global.activeSubscription = getActiveSubscription(customerInfo);
    }

    await updateDoc(
      doc(collection(firestore, "live_users"), auth.currentUser.uid),
      {
        is_unlimited:
          global.activeSubscription &&
          global.activeSubscription.subscription_tier === "Unlimited",
        updated_at: serverTimestamp(),
      }
    );
    sessionUpdate(await getLoggedInUser());
  }
  return (
    <Stack.Navigator
      screenOptions={() => ({
        tabBarIcon: () => {
          return null;
        },
        tabBarLabel: () => {
          return null;
        },
        tabBarBackground: () => {
          return null;
        },
        tabBarHideOnKeyboard: false,
      })}
    >
      <Stack.Screen
        name="TabHome"
        component={TabHome}
        options={() => ({
          headerShown: false,
          tabBarStyle: {
            display: "none",
          },
        })}
      />
      <Stack.Screen
        name="TabLibrary"
        component={TabLibrary}
        options={() => ({
          headerShown: false,
          tabBarStyle: {
            display: "none",
          },
        })}
      />
      <Stack.Screen
        name="TabSettings"
        component={TabSettings}
        options={() => ({
          headerShown: false,
          tabBarStyle: {
            display: "none",
          },
        })}
      />
    </Stack.Navigator>
  );
}

const AppNavigation = () => {
  const { changeTheme } = useThemeContext();
  const { loggedInUser } = useAuthContext();
  const { showAds } = useAdsContext();
  useEffect(() => {
    console.log("heelooooo1");
    setTheme();
    setupRevenueCat();
    setupOneSignal();
    return () => {
      OneSignal.Notifications.clearAll();
    };
  }, []);
  useEffect(() => {
    console.log("heelooooo");
    return () => {};
  }, [loggedInUser]);
  const setupRevenueCat = async () => {
    if (Platform.OS == "ios") {
      Purchases.configure({
        apiKey: "appl_ZCPKHXHnHMEoLanngXTpshrcjJl",
        appUserID: "",
        observerMode: false,
        userDefaultsSuiteName: "",
        usesStoreKit2IfAvailable: true,
        useAmazon: false,
      });
    } else if (Platform.OS == "android") {
      Purchases.configure({
        apiKey: "goog_hxyFjbgCXcjZLPrltHKhnlWeOsd",
        appUserID: "",
        observerMode: false,
        userDefaultsSuiteName: "",
        usesStoreKit2IfAvailable: true,
        useAmazon: false,
      });
    }
    Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);

    const offerings = await Purchases.getOfferings();
    global.packages = offerings.all["Default"].availablePackages;
  };
  const setTheme = async () => {
    try {
      const theme = await AsyncStorage.getItem("theme");
      if (theme) {
        changeTheme(theme);
      }
    } catch (error) {}
  };
  const handleStateChange = () => {
    if (loggedInUser && !loggedInUser.is_unlimited) {
      showAds();
    }
  };
  const setupOneSignal = () => {
    OneSignal.Debug.setLogLevel(LogLevel.Verbose);
    // OneSignal Initialization
    OneSignal.initialize(Constants.ONESIGNAL_APP_ID);

    OneSignal.Notifications.requestPermission(true);
    // Method for listening for notification clicks
    OneSignal.Notifications.addEventListener("click", (event) => {
      console.log("OneSignal: notification clicked:", event);
    });
  };
  return (
    <NavigationContainer onStateChange={handleStateChange}>
      {loggedInUser ? <NavigatorTab /> : <NavigatorAuth />}
    </NavigationContainer>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AdsProvider>
          <SafeAreaProvider>
            <AppNavigation />
            <Toast config={ToastConfig} />
          </SafeAreaProvider>
        </AdsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default Sentry.wrap(App);
