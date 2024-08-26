import React, { useEffect, useState } from "react";
import {
  Image,
  View,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
} from "react-native";
import Constants from "../common/Constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import StyledActionSheet from "../components/StyledActionSheet";
import StyledHeaderTitle from "../components/StyledHeaderTitle";
import StyledBackButton from "../components/StyledBackButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthContext } from "../contexts/AuthContext";
import THEME from "../common/Theme";
import { deleteUser, getAuth } from "firebase/auth";
import Spinner from "../components/Spinner";
import Purchases from "react-native-purchases";
import {
  getActiveSubscription,
  getColor,
  getLoggedInUser,
  presentAlertMessage,
} from "../common/Functions";
import {
  getFirestore,
  collection,
  doc,
  updateDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore/lite";
import FastImage from "react-native-fast-image";
import SettingsOptionItem from "../components/SettingsOptionItem";
import { useThemeContext } from "../contexts/ThemeContext";
import Orientation from "react-native-orientation-locker";
import { useIsFocused } from "@react-navigation/native";

function SettingsScreen({ navigation }) {
  const { theme, changeTheme } = useThemeContext();
  const { sessionClose, sessionUpdate } = useAuthContext();
  const insets = useSafeAreaInsets();
  const [visibleSubscriptionModal, setVisibleSubscriptionModal] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState(null);
  const auth = getAuth();
  const firestore = getFirestore();
  const focused = useIsFocused();

  useEffect(() => {
    loadCustomerInfo();
  }, []);
  useEffect(() => {
    if (customerInfo) {
      global.activeSubscription = getActiveSubscription(customerInfo);
    }
  }, [customerInfo]);
  const loadCustomerInfo = async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      setCustomerInfo(customerInfo);
    } catch (error) {
      console.log("loadCustomerInfo:", error);
    }
  };
  const purchasePackage = async (item) => {
    try {
      setLoading(true);
      let upgradeInfo = null;
      if (Platform.OS == "android") {
        if (
          global.activeSubscription &&
          global.activeSubscription.product_identifier ==
            Constants.SUBSCRIPTIONS.ITEMS[1]
        ) {
          upgradeInfo = {
            oldSKU: Constants.SUBSCRIPTIONS.ITEMS[0],
            prorationMode: PRORATION_MODE.IMMEDIATE_WITH_TIME_PRORATION,
          };
        } else if (
          global.activeSubscription &&
          global.activeSubscription.product_identifier ==
            Constants.SUBSCRIPTIONS.ITEMS[0]
        ) {
          upgradeInfo = {
            oldSKU: Constants.SUBSCRIPTIONS.ITEMS[1],
            prorationMode: PRORATION_MODE.IMMEDIATE_WITH_TIME_PRORATION,
          };
        }
      }
      const { customerInfo } = await Purchases.purchasePackage(
        item,
        upgradeInfo
      );
      await updateDoc(
        doc(collection(firestore, "live_users"), auth.currentUser.uid),
        {
          is_unlimited: true,
          updated_at: serverTimestamp(),
        }
      );
      sessionUpdate(await getLoggedInUser());

      setLoading(false);
      setCustomerInfo(customerInfo);
    } catch (error) {
      if (error.userCancelled) {
      }
      console.log("purchasePackage:", error);
      setLoading(false);
    }
  };
  const purchaseProduct = async (item) => {
    try {
      setLoading(true);
      await Purchases.purchasePackage(item);
      await updateDoc(
        doc(collection(firestore, "live_users"), auth.currentUser.uid),
        {
          purchase_count: increment(3),
          updated_at: serverTimestamp(),
        }
      );
      sessionUpdate(await getLoggedInUser());
      setLoading(false);
    } catch (error) {
      if (error.userCancelled) {
      }
      console.log("purchaseProduct:", error);
      setLoading(false);
    }
  };
  const onChangeThemePress = async () => {
    try {
      setLoading(true);

      await AsyncStorage.setItem("theme", theme === "light" ? "dark" : "light");
      changeTheme(theme === "light" ? "dark" : "light");

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  const removePassword = async () => {
    await AsyncStorage.removeItem("credential");
  };
  const logout = async () => {
    try {
      setLoading(true);
      await auth.signOut();
      await removePassword();

      setLoading(false);
      sessionClose();
    } catch (error) {
      console.log("logout:", error);
      setLoading(false);
    }
  };
  const deleteAccount = async () => {
    try {
      setLoading(true);
      await deleteUser(auth.currentUser);
      await removePassword();

      setLoading(false);
      sessionClose();
    } catch (error) {
      console.log("deleteAccount:", error);
      setLoading(false);
    }
  };
  const onSubscriptionItemPress = (index) => {
    if (global.packages.length == 0) {
      setTimeout(() => {
        presentAlertMessage({
          title: "Some problems occurred, please try again.",
        });
      }, 0);
    } else {
      if (index < 2) {
        if (
          global.activeSubscription &&
          global.activeSubscription.purchased_platform !== Platform.OS
        ) {
          if (global.activeSubscription.purchased_platform == "ios") {
            presentAlertMessage({
              title:
                "Your subscription is being billed and managed through your iTunes account.",
            });
          } else if (
            global.activeSubscription.purchased_platform == "android"
          ) {
            presentAlertMessage({
              title:
                "Your subscription is being billed and managed through your Google Play account.",
            });
          } else {
            presentAlertMessage({
              title:
                "Your subscription is being managed through another platform.",
            });
          }
        } else {
          purchasePackage(global.packages[index]);
        }
      } else if (index == 2) {
        purchaseProduct(global.packages[index]);
      }
    }
  };
  const onBackPress = () => {
    navigation.canGoBack() && navigation.goBack();
  };
  const HeaderView = () => {
    return (
      <View
        style={{
          marginTop: insets.top,
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
          onPress={onBackPress}
        />
        <StyledHeaderTitle
          title={"Settings"}
          containerStyle={{ alignSelf: "center" }}
        />
      </View>
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
      <FastImage
        resizeMode={FastImage.resizeMode.cover}
        style={{
          opacity: 0.2,
          position: "absolute",
          bottom: 0,
          width: Constants.LAYOUT.SCREEN_WIDTH,
          height: (Constants.LAYOUT.SCREEN_WIDTH * 1080 * 2) / 1920,
        }}
        source={require("../../assets/images/img_smoke2.png")}
      />
      <StyledActionSheet
        visible={visibleSubscriptionModal}
        insets={insets}
        title={"Subscribe"}
        content={
          Platform.OS == "ios"
            ? "Subscription will be auto-renewed. Your account will be charged for renewal within 24-hours before current period ends. You can manage subscription & turn off in Account Settings. Cancel at anytime."
            : "Subscription will be auto-renewed. Your account will be charged for renewal within 24-hours before current period ends. You can manage subscription & turn off in Google Play Settings. Cancel at anytime."
        }
        cancel={"Cancel"}
        options={
          global.activeSubscription &&
          global.activeSubscription.product_identifier ==
            Constants.SUBSCRIPTIONS.ITEMS[0]
            ? [
                "Unlimited Cooks - $4.99/mo No Ads",
                "(✓) Unlimited Cooks - $49.99/yr No Ads",
                "Buy 3 Cooks for $4.99 with Ads",
              ]
            : global.activeSubscription &&
              global.activeSubscription.product_identifier ==
                Constants.SUBSCRIPTIONS.ITEMS[1]
            ? [
                "(✓) Unlimited Cooks - $4.99/mo No Ads",
                "Unlimited Cooks - $49.99/yr No Ads",
                "Buy 3 Cooks for $4.99 with Ads",
              ]
            : [
                "Unlimited Cooks - $4.99/mo No Ads",
                "Unlimited Cooks - $49.99/yr No Ads",
                "Buy 3 Cooks for $4.99 with Ads",
                "3 Free Cooks with Ads",
              ]
        }
        onCancelPress={() => {
          setVisibleSubscriptionModal(false);
        }}
        onOptionPress={(index) => {
          onSubscriptionItemPress(index);
          setVisibleSubscriptionModal(false);
        }}
      />
      <HeaderView />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 25 }}
      >
        <SettingsOptionItem
          containerStyle={{ marginTop: 0 }}
          index={0}
          title={"Edit Profile"}
          icon={require("../../assets/images/icon_user.png")}
          mode={"Next"}
          onPress={() => {
            navigation.push("EditProfile");
          }}
          border={true}
        />
        <SettingsOptionItem
          containerStyle={{ marginTop: 0 }}
          index={0}
          title={"Subscribe"}
          icon={require("../../assets/images/icon_paywall.png")}
          mode={"Next"}
          onPress={() => {
            setVisibleSubscriptionModal(true);
          }}
          border={true}
        />
        <SettingsOptionItem
          containerStyle={{ marginTop: 0 }}
          index={0}
          title={"Dark Mode"}
          icon={require("../../assets/images/icon_theme.png")}
          mode={"Switch"}
          onValueChange={() => {
            onChangeThemePress();
          }}
          border={true}
        />
        <SettingsOptionItem
          containerStyle={{ marginTop: 25 }}
          index={0}
          title={"Terms of Service"}
          icon={require("../../assets/images/icon_terms.png")}
          mode={"Next"}
          onPress={() => {
            navigation.push("Terms");
          }}
          border={true}
        />
        <SettingsOptionItem
          containerStyle={{ marginTop: 0 }}
          index={0}
          title={"Privacy Policy"}
          icon={require("../../assets/images/icon_privacy.png")}
          mode={"Next"}
          onPress={() => {
            navigation.push("Privacy");
          }}
          border={true}
        />
        <SettingsOptionItem
          containerStyle={{ marginTop: 25 }}
          index={0}
          title={"Log Out"}
          icon={require("../../assets/images/icon_logout.png")}
          mode={"None"}
          destructive={true}
          onPress={() => {
            logout();
          }}
          border={true}
        />
        <SettingsOptionItem
          containerStyle={{ marginTop: 0 }}
          index={0}
          title={"Delete Account"}
          icon={require("../../assets/images/icon_delete.png")}
          mode={"None"}
          destructive={true}
          onPress={() => {
            deleteAccount();
          }}
        />
      </ScrollView>
      <Spinner visible={loading} />
    </View>
  );
}
export default SettingsScreen;
