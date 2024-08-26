import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Platform,
  StatusBar,
  Text,
  ScrollView,
  Keyboard,
  LayoutAnimation,
  AppState,
} from "react-native";
import Constants from "../common/Constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import StyledButton from "../components/StyledButton";
import StyledTextInput from "../components/StyledTextInput";
import Spinner from "../components/Spinner";
import StyledDateInput from "../components/StyledDateInput";
import StyledSelectInput from "../components/StyledSelectInput";
import moment from "moment";
import BottomMenu from "../components/BottomMenu";
import StyledBackButton from "../components/StyledBackButton";
import StyledHeaderTitle from "../components/StyledHeaderTitle";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  collection,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore/lite";
import { navigateAndReset, presentAlertMessage } from "../common/Functions";
import DeviceInfo from "react-native-device-info";
import axios from "axios";
import THEME from "../common/Theme";
import BarcodeScanModal from "../components/BarcodeScanModal";
import { useAuthContext } from "../contexts/AuthContext";
import FastImage from "react-native-fast-image";
import { useThemeContext } from "../contexts/ThemeContext";

function PreparationScreen({ navigation, route }) {
  const { theme } = useThemeContext();
  const { loggedInUser } = useAuthContext();
  const insets = useSafeAreaInsets();
  const auth = getAuth();
  const firestore = getFirestore();
  const [loading, setLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [visibleBarcodeScanModal, setVisibleBarcodeScanModal] = useState(false);
  const [selectedBarcodeType, setSelectedBarcodeType] = useState(null);
  const [cook, setCook] = useState({
    id: null,
    title: "",
    date: "",
    meatType: "",
    meatSource: "",
    meatWeightLbs: "",
    meatWeightOz: "",
    meatPreparation: "",
    injection: "",
    rub: "",
    wood: "",
    notes: "",
    smoker: "",
    thermometer: "",
    weightBigUnit: "lbs",
    weightSmallUnit: "oz",
    isActive: false,
  });

  const contentScrollViewRef = useRef();
  const titleTextInputRef = useRef();
  const meatTypeTextInputRef = useRef();
  const meatSourceTextInputRef = useRef();
  const meatWeightLbsTextInputRef = useRef();
  const meatWeightOzTextInputRef = useRef();
  const meatPreparationTextInputRef = useRef();
  const meatInjectionTextInputRef = useRef();
  const meatRubTextInputRef = useRef();
  const meatWoodTextInputRef = useRef();
  const notesTextInputRef = useRef();
  const cookRef = useRef(cook);
  useEffect(() => {
    loadCook();
    return () => {
      savePrepartion(cookRef.current);
    };
  }, []);
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "background") {
        savePrepartion(cookRef.current);
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);
  useEffect(() => {
    cookRef.current = cook;
    return () => {};
  }, [cook]);
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
  const onNextPress = async () => {
    savePrepartion(cook);
    navigation.push("Cooking", { id: route.params.id });
  };
  const onBackPress = () => {
    navigation.canGoBack() && navigation.goBack();
  };
  const onSavePress = async () => {
    savePrepartion(cook);
  };
  const loadCook = async () => {
    try {
      setLoading(true);
      const documentSnapShot = await getDoc(
        doc(collection(firestore, "live_cooks"), route.params.id)
      );

      setLoading(false);
      if (documentSnapShot.exists()) {
        const cookData = documentSnapShot.data();

        setCook((prevCook) => ({
          ...prevCook,
          id: cookData.cook_id || null,
          title: cookData.cook_title || "",
          date: cookData.cook_date
            ? moment(cookData.cook_date).format("YYYY-MM-DD HH:mm:ss")
            : "",
          meatType: cookData.meat_type || "",
          meatSource: cookData.meat_source || "",
          meatWeightLbs: cookData.meat_weight || "",
          meatWeightOz: cookData.meat_weight1 || "",
          weightBigUnit: cookData.meat_weight_unit || "",
          weightSmallUnit: cookData.meat_weight_unit1 || "",
          meatPreparation: cookData.meat_preparation || "",
          injection: cookData.meat_injection || "",
          rub: cookData.meat_rub || "",
          wood: cookData.meat_wood_charcoal || "",
          smoker: cookData.meat_smoker_grill || "",
          thermometer: cookData.meat_thermometer || "",
          notes: cookData.meat_notes || "",
          isActive: cookData.is_active || false,
        }));
      } else {
        setTimeout(() => {
          presentAlertMessage({
            title: "Some problems occurred, please try again.",
          });
        }, 100);
      }
    } catch (error) {
      console.log("loadCook:", error);
      setLoading(false);
    }
  };
  const savePrepartion = async (cook) => {
    Keyboard.dismiss();
    if (cook.id) {
      try {
        const values = {
          build_number: DeviceInfo.getBuildNumber(),
          build_version: DeviceInfo.getVersion(),
          platform: Platform.OS,
          user_id: auth.currentUser.uid,
          cook_date: moment(cook.date).valueOf(),
          meat_weight_unit: cook.weightBigUnit,
          meat_weight_unit1: cook.weightSmallUnit,
          cook_title: cook.title,
          meat_type: cook.meatType,
          meat_source: cook.meatSource,
          meat_weight: cook.meatWeightLbs,
          meat_weight1: cook.meatWeightOz,
          meat_preparation: cook.meatPreparation,
          meat_injection: cook.injection,
          meat_rub: cook.rub,
          meat_wood_charcoal: cook.wood,
          meat_smoker_grill: cook.smoker,
          meat_thermometer: cook.thermometer,
          meat_notes: cook.notes,
          updated_at: serverTimestamp(),
        };
        updateDoc(doc(collection(firestore, "live_cooks"), cook.id), values);
        console.log("Preparation saved successfully!");
      } catch (error) {
        console.log("Failed to save preparation");
        throw error;
      }
    }
  };
  const lookupBarcode = async ({ field, barcode }) => {
    setSelectedBarcodeType(null);
    setVisibleBarcodeScanModal(false);

    try {
      setLoading(true);
      const url = `https://api.barcodelookup.com/v3/products?barcode=${barcode}&formatted=y&key=${Constants.BARCODE_API_KEY}`;
      const response = await axios.get(url);
      setLoading(false);
      if (
        response.data &&
        response.data.products &&
        response.data.products.length > 0 &&
        response.data.products[0].title
      ) {
        console.log("response", response.data.products[0].title);
        if (field === "meat_injection") {
          const newInjection = `${cook.injection}\n${response.data.products[0].title}`;
          setCook((prevCook) => ({ ...prevCook, injection: newInjection }));
        }
        if (field === "meat_rub") {
          const newRub = `${cook.rub}\n${response.data.products[0].title}`;
          setCook((prevCook) => ({ ...prevCook, rub: newRub }));
        }
        if (field === "meat_wood_charcoal") {
          const newWood = `${cook.wood}\n${response.data.products[0].title}`;
          setCook((prevCook) => ({ ...prevCook, wood: newWood }));
        }
      } else {
        presentAlertMessage({
          title: "Unable to retrieve product information.",
        });
      }
      // const options = {
      //     method: 'GET',
      //     headers: {
      //         'X-RapidAPI-Key': `${Constants.EAN_LOOKUP_API_KEY}`,
      //         'X-RapidAPI-Host': 'ean-lookup.p.rapidapi.com',
      //     },
      // };

      // const response = await axios.get(`https://ean-lookup.p.rapidapi.com/api?op=barcode-lookup&ean=${barcode}&format=json`, options);
      // setLoading(false)
      // if (response.data && response.data.length > 0 && response.data[0].name) {
      //     if (field === 'meat_injection') {
      //         setCook(prevCook => ({ ...prevCook, injection: response.data.products[0].title }))
      //     }
      //     if (field === 'meat_rub') {
      //         setCook(prevCook => ({ ...prevCook, rub: response.data.products[0].title }))
      //     }
      //     if (field === 'meat_wood_charcoal') {
      //         setCook(prevCook => ({ ...prevCook, wood: response.data.products[0].title }))
      //     }
      // } else {
      //     presentAlertMessage({ title: "Unable to retrieve product information." })
      // }
    } catch (error) {
      console.log("lookupBarcode:", error);
      setLoading(false);
      setTimeout(() => {
        presentAlertMessage({
          title: "Unable to retrieve product information.",
        });
      }, 100);
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
      <BarcodeScanModal
        visible={visibleBarcodeScanModal}
        type={selectedBarcodeType}
        onClose={() => {
          setSelectedBarcodeType(null);
          setVisibleBarcodeScanModal(false);

          // lookupBarcode({ field: selectedBarcodeType, barcode: "6911657930258" })
        }}
        onBarcodeScanned={(barcode) => {
          lookupBarcode({ field: selectedBarcodeType, barcode: barcode });
        }}
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
          title={cook.id ? "Preparation" : "Loading.."}
          containerStyle={{ alignSelf: "center" }}
        />
      </View>
      {cook.id && (
        <ScrollView
          ref={contentScrollViewRef}
          keyboardShouldPersistTaps={"handled"}
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 25,
            paddingBottom:
              Platform.OS === "ios"
                ? keyboardHeight === 0
                  ? 25
                  : keyboardHeight + 10
                : keyboardHeight === 0
                ? 25
                : 10,
          }}
        >
          <StyledTextInput
            ref={titleTextInputRef}
            containerStyle={{ marginTop: 35 }}
            placeholder={"e.g. Fourth of July Ribs"}
            initialValue={cook.title}
            autoCapitalize={"words"}
            keyboardType={"default"}
            returnKeyType={"next"}
            onFocus={() => {
              setTimeout(() => {
                contentScrollViewRef.current.scrollTo({ y: 0, animated: true });
              }, 500);
            }}
            onChangeValue={(value) => {
              setCook((prevCook) => ({ ...prevCook, title: value }));
            }}
            onSubmitEditing={() => {
              Keyboard.dismiss();
            }}
            icon={require("../../assets/images/icon_user.png")}
            label={"Title"}
          />
          <StyledDateInput
            containerStyle={{ marginTop: 35 }}
            icon={require("../../assets/images/icon_date.png")}
            label={"Date"}
            mode={"datetime"}
            minimumDate={moment().add("-5", "years").toDate()}
            editable={!(cook.id && cook.isActive)}
            placeholder={""}
            initialValue={cook.date}
            onChangeValue={(value) => {
              setCook((prevCook) => ({ ...prevCook, date: value }));
            }}
            onShown={() => {
              Keyboard.dismiss();
            }}
          />
          <StyledTextInput
            ref={meatTypeTextInputRef}
            containerStyle={{ marginTop: 35 }}
            placeholder={"e.g. Pork, Chicken, Fish"}
            initialValue={cook.meatType}
            autoCapitalize={"words"}
            keyboardType={"default"}
            returnKeyType={"next"}
            onFocus={() => {
              setTimeout(() => {
                contentScrollViewRef.current.scrollTo({
                  y: 48 * 2 + 35 * 2,
                  animated: true,
                });
              }, 500);
            }}
            onChangeValue={(value) => {
              setCook((prevCook) => ({ ...prevCook, meatType: value }));
            }}
            onSubmitEditing={() => {
              meatSourceTextInputRef.current.focus();
            }}
            icon={require("../../assets/images/icon_meat_type.png")}
            label={"Meat Type"}
          />
          <StyledTextInput
            ref={meatSourceTextInputRef}
            containerStyle={{ marginTop: 35 }}
            placeholder={"e.g. Bob's Butcher"}
            initialValue={cook.meatSource}
            autoCapitalize={"words"}
            keyboardType={"default"}
            returnKeyType={"next"}
            onFocus={() => {
              setTimeout(() => {
                contentScrollViewRef.current.scrollTo({
                  y: 48 * 3 + 35 * 3,
                  animated: true,
                });
              }, 500);
            }}
            onChangeValue={(value) => {
              setCook((prevCook) => ({ ...prevCook, meatSource: value }));
            }}
            onSubmitEditing={() => {
              meatWeightLbsTextInputRef.current.focus();
            }}
            icon={require("../../assets/images/icon_meat_source.png")}
            label={"Meat Source"}
          />
          <View style={{ marginTop: 35 }}>
            <Text
              style={{
                position: "absolute",
                top: -25,
                left: 0,
                color:
                  theme === "light"
                    ? THEME.LIGHT_COLOR.TEXT_INPUT_LABEL
                    : THEME.DARK_COLOR.TEXT_INPUT_LABEL,
                fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR,
                fontSize: Constants.FONT_SIZE.FT13,
              }}
            >
              {"Meat Weight"}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <StyledTextInput
                ref={meatWeightLbsTextInputRef}
                containerStyle={{
                  width: (Constants.LAYOUT.SCREEN_WIDTH - 50 - 30) * 0.25,
                }}
                placeholder={""}
                initialValue={cook.meatWeightLbs}
                keyboardType={"numbers-and-punctuation"}
                returnKeyType={"done"}
                onFocus={() => {
                  setTimeout(() => {
                    contentScrollViewRef.current.scrollTo({
                      y: 48 * 4 + 35 * 4,
                      animated: true,
                    });
                  }, 500);
                }}
                onChangeValue={(value) => {
                  setCook((prevCook) => ({
                    ...prevCook,
                    meatWeightLbs: value,
                  }));
                }}
                onSubmitEditing={() => {
                  meatWeightOzTextInputRef.current.focus();
                }}
                label={""}
              />
              <StyledSelectInput
                containerStyle={{
                  width: (Constants.LAYOUT.SCREEN_WIDTH - 50 - 30) * 0.25,
                }}
                itemStyle={{
                  width: (Constants.LAYOUT.SCREEN_WIDTH - 50 - 30) * 0.25 - 3,
                }}
                items={["lbs", "kg"]}
                label={""}
                placeholder={"lbs"}
                value={cook.weightBigUnit}
                onFocus={() => {
                  Keyboard.dismiss();
                }}
                onChangeValue={(value) => {
                  setCook((prevCook) => ({
                    ...prevCook,
                    weightBigUnit: value,
                  }));
                }}
              />
              <StyledTextInput
                ref={meatWeightOzTextInputRef}
                containerStyle={{
                  width: (Constants.LAYOUT.SCREEN_WIDTH - 50 - 30) * 0.25,
                }}
                placeholder={""}
                initialValue={cook.meatWeightOz}
                keyboardType={"numbers-and-punctuation"}
                returnKeyType={"done"}
                onFocus={() => {
                  setTimeout(() => {
                    contentScrollViewRef.current.scrollTo({
                      y: 48 * 4 + 35 * 4,
                      animated: true,
                    });
                  }, 500);
                }}
                onChangeValue={(value) => {
                  setCook((prevCook) => ({ ...prevCook, meatWeightOz: value }));
                }}
                onSubmitEditing={() => {
                  meatPreparationTextInputRef.current.focus();
                }}
                label={""}
              />
              <StyledSelectInput
                containerStyle={{
                  width: (Constants.LAYOUT.SCREEN_WIDTH - 50 - 30) * 0.25,
                }}
                itemStyle={{
                  width: (Constants.LAYOUT.SCREEN_WIDTH - 50 - 30) * 0.25 - 3,
                }}
                items={["oz", "g",]}
                label={""}
                placeholder={"oz"}
                value={cook.weightSmallUnit}
                onFocus={() => {
                  Keyboard.dismiss();
                }}
                onChangeValue={(value) => {
                  setCook((prevCook) => ({
                    ...prevCook,
                    weightSmallUnit: value,
                  }));
                }}
              />
            </View>
          </View>
          <StyledTextInput
            ref={meatPreparationTextInputRef}
            containerStyle={{ marginTop: 35, height: 120 }}
            placeholder={""}
            initialValue={cook.meatPreparation}
            autoCapitalize={"sentences"}
            keyboardType={"default"}
            returnKeyType={"default"}
            onFocus={() => {
              setTimeout(() => {
                contentScrollViewRef.current.scrollTo({
                  y: 48 * 5 + 35 * 5,
                  animated: true,
                });
              }, 500);
            }}
            onChangeValue={(value) => {
              setCook((prevCook) => ({ ...prevCook, meatPreparation: value }));
            }}
            onSubmitEditing={() => {
              meatInjectionTextInputRef.current.focus();
            }}
            multiline={true}
            icon={require("../../assets/images/icon_note.png")}
            label={"Meat Preparation"}
          />
          <StyledTextInput
            ref={meatInjectionTextInputRef}
            containerStyle={{ marginTop: 35, height: 80 }}
            placeholder={""}
            initialValue={cook.injection}
            keyboardType={"default"}
            returnKeyType={"default"}
            autoCapitalize={"sentences"}
            onFocus={() => {
              setTimeout(() => {
                contentScrollViewRef.current.scrollTo({
                  y: 48 * 6 + 35 * 6 + 72,
                  animated: true,
                });
              }, 500);
            }}
            onChangeValue={(value) => {
              setCook((prevCook) => ({ ...prevCook, injection: value }));
            }}
            onSubmitEditing={() => {
              meatRubTextInputRef.current.focus();
            }}
            icon={require("../../assets/images/icon_injection.png")}
            rightIcon={require("../../assets/images/scan.png")}
            multiline={true}
            onRightIconPress={() => {
              Keyboard.dismiss();
              setTimeout(() => {
                setSelectedBarcodeType("meat_injection");
                // lookupBarcode({ field: 'meat_injection', barcode: "6911657930258" })
                setVisibleBarcodeScanModal(true);
              }, 100);
            }}
            label={"Injection (scan from UPC code or enter)"}
          />
          <StyledTextInput
            ref={meatRubTextInputRef}
            containerStyle={{ marginTop: 35, height: 80 }}
            placeholder={""}
            initialValue={cook.rub}
            keyboardType={"default"}
            returnKeyType={"default"}
            autoCapitalize={"sentences"}
            onFocus={() => {
              setTimeout(() => {
                contentScrollViewRef.current.scrollTo({
                  y: 48 * 7 + 35 * 7 + 72,
                  animated: true,
                });
              }, 500);
            }}
            onChangeValue={(value) => {
              setCook((prevCook) => ({ ...prevCook, rub: value }));
            }}
            onSubmitEditing={() => {
              meatWoodTextInputRef.current.focus();
            }}
            icon={require("../../assets/images/icon_rub.png")}
            rightIcon={require("../../assets/images/scan.png")}
            multiline={true}
            onRightIconPress={() => {
              Keyboard.dismiss();
              setTimeout(() => {
                setSelectedBarcodeType("meat_rub");
                setVisibleBarcodeScanModal(true);
              }, 100);
            }}
            label={"Rub (scan from UPC code or enter)"}
          />
          <StyledTextInput
            ref={meatWoodTextInputRef}
            containerStyle={{ marginTop: 35, height: 80 }}
            placeholder={""}
            initialValue={cook.wood}
            keyboardType={"default"}
            returnKeyType={"default"}
            autoCapitalize={"sentences"}
            onFocus={() => {
              setTimeout(() => {
                contentScrollViewRef.current.scrollTo({
                  y: 48 * 8 + 35 * 8 + 72,
                  animated: true,
                });
              }, 500);
            }}
            onChangeValue={(value) => {
              setCook((prevCook) => ({ ...prevCook, wood: value }));
            }}
            onSubmitEditing={() => {
              Keyboard.dismiss();
            }}
            icon={require("../../assets/images/icon_fire.png")}
            rightIcon={require("../../assets/images/scan.png")}
            multiline={true}
            onRightIconPress={() => {
              Keyboard.dismiss();
              setTimeout(() => {
                setSelectedBarcodeType("meat_wood_charcoal");
                setVisibleBarcodeScanModal(true);
              }, 100);
            }}
            label={"Wood/Charcoal (scan from UPC code or enter)"}
          />
          <StyledSelectInput
            marginLeft={30}
            containerStyle={{ marginTop: 10, borderRadius: 8 }}
            itemStyle={{}}
            icon={require("../../assets/images/icon_grill.png")}
            items={
              loggedInUser.user_smoker_grill
                ? loggedInUser.user_smoker_grill.split("\n")
                : []
            }
            label={"Smoker/Grill"}
            placeholder={" "}
            value={cook.smoker}
            onFocus={() => {
              Keyboard.dismiss();
            }}
            onChangeValue={(value) => {
              setCook((prevCook) => ({ ...prevCook, smoker: value }));
            }}
          />
          <StyledSelectInput
            marginLeft={30}
            containerStyle={{ marginTop: 10, borderRadius: 8 }}
            itemStyle={{}}
            icon={require("../../assets/images/icon_thermometer.png")}
            items={
              loggedInUser.user_thermometer
                ? loggedInUser.user_thermometer.split("\n")
                : []
            }
            label={"Thermometer"}
            placeholder={" "}
            value={cook.thermometer}
            onFocus={() => {
              Keyboard.dismiss();
            }}
            onChangeValue={(value) => {
              setCook((prevCook) => ({ ...prevCook, thermometer: value }));
            }}
          />
          <StyledTextInput
            ref={notesTextInputRef}
            containerStyle={{ marginTop: 35, height: 120 }}
            placeholder={""}
            initialValue={cook.notes}
            autoCapitalize={"sentences"}
            keyboardType={"default"}
            returnKeyType={"default"}
            onFocus={() => {
              setTimeout(() => {
                contentScrollViewRef.current.scrollTo({
                  y: 48 * 11 + 35 * 11 + 72,
                  animated: true,
                });
              }, 500);
            }}
            onChangeValue={(value) => {
              setCook((prevCook) => ({ ...prevCook, notes: value }));
            }}
            onSubmitEditing={() => {
              Keyboard.dismiss();
            }}
            multiline={true}
            icon={require("../../assets/images/icon_note.png")}
            label={"Notes"}
          />
          <View
            style={{
              marginTop: 15,

              marginBottom: 15,
              height: 1,
              width: Constants.LAYOUT.SCREEN_WIDTH - 50,
              backgroundColor:
                theme === "light"
                  ? THEME.LIGHT_COLOR.SEPERATOR
                  : THEME.DARK_COLOR.SEPERATOR,
            }}
          />
          <StyledButton
            containerStyle={{
              marginBottom: 0,
              width: Constants.LAYOUT.SCREEN_WIDTH - 50,
            }}
            title={"Next (The Cook)"}
            onPress={onNextPress}
          />
        </ScrollView>
      )}
      {cook.id && keyboardHeight === 0 && (
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
          onSavePress={onSavePress}
          onLibraryPress={() => {
            navigateAndReset({
              navigation: navigation,
              tabNavigator: "TabLibrary",
              rootScreen: "Library",
            });
          }}
          onProfilePress={() => {
            navigation.navigate("TabSettings");
          }}
        />
      )}
      <Spinner visible={loading} />
    </View>
  );
}

export default PreparationScreen;
