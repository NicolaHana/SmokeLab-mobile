import React, { useEffect, useState } from "react";
import {
  View,
  Platform,
  StatusBar,
  Text,
  Keyboard,
  ScrollView,
  LayoutAnimation,
} from "react-native";
import Constants from "../common/Constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import StyledTextInput from "../components/StyledTextInput";
import StyledSelectInput from "../components/StyledSelectInput";
import StyledButton from "../components/StyledButton";
import BottomMenu from "../components/BottomMenu";
import StyledHeaderTitle from "../components/StyledHeaderTitle";
import StyledBackButton from "../components/StyledBackButton";
import Spinner from "../components/Spinner";
import { navigateAndReset, presentAlertMessage } from "../common/Functions";
import {
  getFirestore,
  collection,
  where,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore/lite";
import { getAuth } from "firebase/auth";
import THEME from "../common/Theme";
import Orientation, {
  OrientationLocker,
  LANDSCAPE,
} from "react-native-orientation-locker";
import FastImage from "react-native-fast-image";
import { useThemeContext } from "../contexts/ThemeContext";
import SelectDropdown from "react-native-select-dropdown";

function LibraryScreen({ navigation }) {
  const { theme } = useThemeContext();
  const insets = useSafeAreaInsets();
  const auth = getAuth();
  const firestore = getFirestore();
  const [filter, setFilter] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [fields, setFields] = useState("");
  // useEffect(() => {

  //   return () => {};
  // }, []);
  // useEffect(() => {
  //   Orientation.lockToLandscapeRight();
  //   return () => {
  //     Orientation.unlockAllOrientations();
  //   };
  // }, []);
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
    setKeyboardHeight(height);
  };
  const keyboardDidHide = (event) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setKeyboardHeight(0);
  };
  useEffect(() => {
    Orientation.lockToPortrait();
    return () => {};
  }, []);
  const onBackPress = () => {
    navigation.canGoBack() && navigation.goBack();
  };
  const onSearchPress = () => {
    if (filter !== "" || (keyword !== "" && fields !== "")) {
      loadCooks();
    }
  };
  const loadCooks = async () => {
    try {
      setLoading(true);
      const cooksQuery = query(
        collection(firestore, "live_cooks"),
        where("user_id", "==", auth.currentUser.uid),
        // where('user_id', '==', 'BDpF2oNQKFZW0yc84li3XWd2ebH3'),
        where("is_active", "==", true),
        orderBy("cook_date", "desc")
      );
      const querySnapshot = await getDocs(cooksQuery);
      setLoading(false);

      let cooks = [];
      querySnapshot.forEach((documentSnapshot) => {
        const cook = documentSnapshot.data();
        if (keyword !== "" && fields !== "") {
          if (fields === Constants.SEARH.MEAT_TYPE) {
            if (
              cook.meat_type &&
              cook.meat_type.toLowerCase().includes(keyword.toLowerCase())
            ) {
              cooks.push(cook);
            }
          } else if (fields === Constants.SEARH.INJECTION) {
            if (
              cook.meat_injection &&
              cook.meat_injection.toLowerCase().includes(keyword.toLowerCase())
            ) {
              cooks.push(cook);
            }
          } else if (fields === Constants.SEARH.RUB) {
            if (
              cook.meat_rub &&
              cook.meat_rub.toLowerCase().includes(keyword.toLowerCase())
            ) {
              cooks.push(cook);
            }
          } else if (fields === Constants.SEARH.WOOD_CHARCOAL) {
            if (
              cook.meat_wood_charcoal &&
              cook.meat_wood_charcoal
                .toLowerCase()
                .includes(keyword.toLowerCase())
            ) {
              cooks.push(cook);
            }
          } else if (fields === Constants.SEARH.ALL_FIELDS) {
            if (
              (cook.cook_title &&
                cook.cook_title
                  .toLowerCase()
                  .includes(keyword.toLowerCase())) ||
              (cook.meat_type &&
                cook.meat_type.toLowerCase().includes(keyword.toLowerCase())) ||
              (cook.meat_source &&
                cook.meat_source
                  .toLowerCase()
                  .includes(keyword.toLowerCase())) ||
              (cook.meat_injection &&
                cook.meat_injection
                  .toLowerCase()
                  .includes(keyword.toLowerCase())) ||
              (cook.meat_rub &&
                cook.meat_rub.toLowerCase().includes(keyword.toLowerCase())) ||
              (cook.meat_wood_charcoal &&
                cook.meat_wood_charcoal
                  .toLowerCase()
                  .includes(keyword.toLowerCase())) ||
              (cook.meat_smoker_grill &&
                cook.meat_smoker_grill
                  .toLowerCase()
                  .includes(keyword.toLowerCase())) ||
              (cook.meat_thermometer &&
                cook.meat_thermometer
                  .toLowerCase()
                  .includes(keyword.toLowerCase()))
            ) {
              cooks.push(cook);
            }
          }
        } else {
          cooks.push(cook);
        }
      });

      let field = "date";
      let order = "asc";
      if (filter === Constants.SEARH.MOST_RECENT_COOKS) {
        cooks = cooks.filter((_, index) => index < 2);
        field = "date";
        order = "asc";
      }
      if (filter === Constants.SEARH.HIGHEST_RATED_COOKS) {
        cooks = cooks.filter((_, index) => index < 10);
        field = "rating";
        order = "asc";
      }
      if (filter === Constants.SEARH.ALL_OF_MY_COOKS) {
        field = "date";
        order = "asc";
      }

      if (cooks.length > 0) {
        setTimeout(() => {
          navigation.push("MyCooks", {
            cooks: cooks,
            field: field,
            order: order,
          });
        }, 100);
      } else {
        presentAlertMessage({
          title: "There are no cooks to match your search.",
        });
      }
    } catch (error) {
      console.log("loadCooks:", error);
      setLoading(false);
    }
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
          title={"My Search"}
          containerStyle={{ alignSelf: "center" }}
        />
      </View>
      <ScrollView
        keyboardShouldPersistTaps={"handled"}
        style={{ flex: 1 }}
        contentContainerStyle={{ alignItems: "center" }}
        scrollEnabled={false}
      >
        <StyledSelectInput
          marginLeft={30}
          containerStyle={{ borderRadius: 24 }}
          itemStyle={{}}
          icon={require("../../assets/images/icon_field.png")}
          items={[
            Constants.SEARH.MEAT_TYPE,
            Constants.SEARH.INJECTION,
            Constants.SEARH.RUB,
            Constants.SEARH.WOOD_CHARCOAL,
            Constants.SEARH.ALL_FIELDS,
          ]}
          label={""}
          placeholder={"Fields to search"}
          value={fields}
          onFocus={() => {
            Keyboard.dismiss();
          }}
          onChangeValue={(value) => setFields(value)}
        />
        <StyledTextInput
          containerStyle={{ marginTop: 12, borderRadius: 24 }}
          placeholder={"Search my cooks for..."}
          initialValue={keyword}
          autoCapitalize={"none"}
          keyboardType={"default"}
          returnKeyType={"done"}
          onChangeValue={(value) => {
            setKeyword(value);
          }}
          onSubmitEditing={() => {
            Keyboard.dismiss();
          }}
          icon={require("../../assets/images/icon_search.png")}
          label={""}
        />
        <Text
          style={{
            marginTop: 16,
            alignSelf: "center",
            fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM,
            fontSize: Constants.FONT_SIZE.FT16,
            color:
              theme === "light"
                ? THEME.LIGHT_COLOR.TEXT_100
                : THEME.DARK_COLOR.TEXT_100,
          }}
        >
          {"OR"}
        </Text>
        <StyledSelectInput
          marginLeft={30}
          containerStyle={{ marginTop: 16, borderRadius: 24 }}
          itemStyle={{}}
          icon={require("../../assets/images/icon_filter.png")}
          items={[
            Constants.SEARH.HIGHEST_RATED_COOKS,
            Constants.SEARH.MOST_RECENT_COOKS,
            Constants.SEARH.ALL_OF_MY_COOKS,
          ]}
          label={""}
          placeholder={"Show my..."}
          value={filter}
          onFocus={() => {
            Keyboard.dismiss();
          }}
          onChangeValue={(value) => setFilter(value)}
        />

        <StyledButton
          containerStyle={{
            marginTop: 32,
            width: Constants.LAYOUT.SCREEN_WIDTH - 50,
          }}
          title={"Search"}
          onPress={onSearchPress}
        />
      </ScrollView>
      {keyboardHeight === 0 && (
        <BottomMenu
          containerStyle={{
            paddingBottom:
              keyboardHeight === 0 ? insets.bottom + 15 : keyboardHeight + 15,
          }}
          onHomePress={() => {
            navigateAndReset({
              navigation: navigation,
              tabNavigator: "TabHome",
              rootScreen: "Home",
            });
          }}
          onSavePress={() => {}}
          onLibraryPress={() => {}}
          onProfilePress={() => {
            navigation.navigate("TabSettings");
          }}
        />
      )}
      <Spinner visible={loading} />
    </View>
  );
}

export default LibraryScreen;
