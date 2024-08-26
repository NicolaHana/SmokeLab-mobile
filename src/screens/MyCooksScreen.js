import React, { useEffect, useState } from "react";
import {
  Image,
  View,
  Platform,
  StatusBar,
  FlatList,
  Alert,
  Dimensions,
} from "react-native";
import Constants from "../common/Constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import EmptyView from "../components/EmptyView";
import LibraryHeader from "../components/LibraryHeader";
import LibraryItem from "../components/LibraryItem";
import StyledBackButton from "../components/StyledBackButton";
import StyledHeaderTitle from "../components/StyledHeaderTitle";
import Spinner from "../components/Spinner";
import {
  getFirestore,
  doc,
  collection,
  deleteDoc,
} from "firebase/firestore/lite";
import THEME from "../common/Theme";
import Orientation from "react-native-orientation-locker";
import StyledConfirmModal from "../components/StyledConfirmModal";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import FastImage from "react-native-fast-image";
import { useThemeContext } from "../contexts/ThemeContext";

function MyCooksScreen({ navigation, route }) {
  const { theme } = useThemeContext();
  const insets = useSafeAreaInsets();
  const firestore = getFirestore();
  const [loading, setLoading] = useState(false);
  const focused = useIsFocused();
  // const [focused, setFocused] = useState(false)
  const [cooks, setCooks] = useState(route.params.cooks);
  const [cookIdToDelete, setCookIdToDelete] = useState(null);
  const [sort, setSort] = useState({
    field: route.params.field,
    order: route.params.order,
  });
  useEffect(() => {
    if (focused) {
      Orientation.lockToLandscape();
    }
    return () => {
      Orientation.lockToPortrait();
    };
  }, [focused]);
  // useFocusEffect(
  //     React.useCallback(() => {
  //         setFocused(true)
  //         return () => {
  //             setFocused(false)
  //         }
  //     }, [focused])
  // );
  useEffect(() => {
    sortCooksBy({ field: route.params.field, order: route.params.order });
    return () => {};
  }, []);
  const onBackPress = () => {
    navigation.canGoBack() && navigation.goBack();
  };
  const deleteCook = async (id) => {
    try {
      setCookIdToDelete(null);
      setLoading(true);
      await deleteDoc(doc(collection(firestore, "live_cooks"), id));

      setLoading(false);
      setCooks(cooks.filter((cook) => cook.cook_id !== id));
    } catch (error) {
      console.log("deleteCook:", error);
      setLoading(false);
    }
  };
  const sortCooksBy = ({ field, order }) => {
    if (field === "title") {
      if (order === "asc") {
        setCooks(
          cooks.sort((a, b) => {
            if (a.cook_title > b.cook_title) return -1;
            if (a.cook_title < b.cook_title) return 1;
            return 0;
          })
        );
      } else {
        setCooks(
          cooks.sort((a, b) => {
            if (a.cook_title > b.cook_title) return 1;
            if (a.cook_title < b.cook_title) return -1;
            return 0;
          })
        );
      }
    } else if (field === "meat") {
      if (order === "asc") {
        setCooks(
          cooks.sort((a, b) => {
            if (a.meat_type > b.meat_type) return -1;
            if (a.meat_type < b.meat_type) return 1;
            return 0;
          })
        );
      } else {
        setCooks(
          cooks.sort((a, b) => {
            if (a.meat_type > b.meat_type) return 1;
            if (a.meat_type < b.meat_type) return -1;
            return 0;
          })
        );
      }
    } else if (field === "date") {
      if (order === "asc") {
        setCooks(
          cooks.sort((a, b) => {
            if (a.cook_date > b.cook_date) return -1;
            if (a.cook_date < b.cook_date) return 1;
            return 0;
          })
        );
      } else {
        setCooks(
          cooks.sort((a, b) => {
            if (a.cook_date > b.cook_date) return 1;
            if (a.cook_date < b.cook_date) return -1;
            return 0;
          })
        );
      }
    } else if (field === "rating") {
      if (order === "asc") {
        setCooks(
          cooks.sort((a, b) => {
            return (
              Number(b.meat_ratings ? b.meat_ratings.overal_rating : 0) -
              Number(a.meat_ratings ? a.meat_ratings.overal_rating : 0)
            );
          })
        );
      } else {
        setCooks(
          cooks.sort((a, b) => {
            return (
              Number(a.meat_ratings ? a.meat_ratings.overal_rating : 0) -
              Number(b.meat_ratings ? b.meat_ratings.overal_rating : 0)
            );
          })
        );
      }
    } else if (field === "photo") {
      if (order === "asc") {
        setCooks(
          cooks.sort((a, b) => {
            if (a.meat_photos.length > b.meat_photos.length) return -1;
            if (a.meat_photos.length < b.meat_photos.length) return 1;
            return 0;
          })
        );
      } else {
        setCooks(
          cooks.sort((a, b) => {
            if (a.meat_photos.length > b.meat_photos.length) return 1;
            if (a.meat_photos.length < b.meat_photos.length) return -1;
            return 0;
          })
        );
      }
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
      <StyledConfirmModal
        visible={!!cookIdToDelete}
        title={"Delete the cook?"}
        content={"Are you sure you want to delete the cook?"}
        cancel={"Cancel"}
        onCancelPress={() => {
          setCookIdToDelete(null);
        }}
        confirm={"Delete"}
        onConfirmPress={() => {
          deleteCook(cookIdToDelete);
        }}
      />
      <FastImage
        resizeMode={FastImage.resizeMode.cover}
        style={{
          opacity: 0.2,
          position: "absolute",
          bottom: 0,
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
        }}
        source={require("../../assets/images/img_smoke2.png")}
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
          title={"My Cooks"}
          containerStyle={{ alignSelf: "center" }}
        />
      </View>
      <FlatList
        data={cooks}
        ListEmptyComponent={() => (
          <EmptyView
            message={"No cooks"}
            textStyle={{}}
            onRefresh={onRefresh}
          />
        )}
        ListHeaderComponent={() => (
          <View style={{}}>
            <LibraryHeader
              containerStyle={{
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
              }}
              sort={sort}
              insets={insets}
              onTitleSortPress={() => {
                sortCooksBy({
                  field: "title",
                  order:
                    sort && sort.field === "title"
                      ? sort.order === "asc"
                        ? "desc"
                        : "asc"
                      : "asc",
                });
                setSort({
                  field: "title",
                  order:
                    sort && sort.field === "title"
                      ? sort.order === "asc"
                        ? "desc"
                        : "asc"
                      : "asc",
                });
              }}
              onMeatSortPress={() => {
                sortCooksBy({
                  field: "meat",
                  order:
                    sort && sort.field === "meat"
                      ? sort.order === "asc"
                        ? "desc"
                        : "asc"
                      : "asc",
                });
                setSort({
                  field: "meat",
                  order:
                    sort && sort.field === "meat"
                      ? sort.order === "asc"
                        ? "desc"
                        : "asc"
                      : "asc",
                });
              }}
              onDateSortPress={() => {
                sortCooksBy({
                  field: "date",
                  order:
                    sort && sort.field === "date"
                      ? sort.order === "asc"
                        ? "desc"
                        : "asc"
                      : "asc",
                });
                setSort({
                  field: "date",
                  order:
                    sort && sort.field === "date"
                      ? sort.order === "asc"
                        ? "desc"
                        : "asc"
                      : "asc",
                });
              }}
              onRatingSortPress={() => {
                sortCooksBy({
                  field: "rating",
                  order:
                    sort && sort.field === "rating"
                      ? sort.order === "asc"
                        ? "desc"
                        : "asc"
                      : "asc",
                });
                setSort({
                  field: "rating",
                  order:
                    sort && sort.field === "rating"
                      ? sort.order === "asc"
                        ? "desc"
                        : "asc"
                      : "asc",
                });
              }}
              onPhotoSortPress={() => {
                sortCooksBy({
                  field: "photo",
                  order:
                    sort && sort.field === "photo"
                      ? sort.order === "asc"
                        ? "desc"
                        : "asc"
                      : "asc",
                });
                setSort({
                  field: "photo",
                  order:
                    sort && sort.field === "photo"
                      ? sort.order === "asc"
                        ? "desc"
                        : "asc"
                      : "asc",
                });
              }}
            />
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingLeft: insets.left === 0 ? 25 : insets.left,
          paddingRight: insets.right === 0 ? 25 : insets.right,
          paddingBottom: insets.bottom === 0 ? 25 : insets.bottom,
        }}
        style={{ marginTop: 10, flex: 1 }}
        renderItem={({ item, index }) => (
          <LibraryItem
            key={index.toString()}
            item={item}
            insets={insets}
            containerStyle={{
              borderBottomLeftRadius: index === cooks.length - 1 ? 8 : 0,
              borderBottomRightRadius: index === cooks.length - 1 ? 8 : 0,
            }}
            onPress={() => {
              navigation.push("Cook", { id: item.cook_id });
            }}
            onDeletePress={() => {
              Alert.alert(
                "Delete the cook?",
                "Are you sure you want to delete the cook?",
                [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "Delete",
                    onPress: () => deleteCook(item.cook_id),
                    style: "destructive",
                  },
                ],
                {
                  cancelable: true,
                }
              );
            }}
          />
        )}
      />
      <Spinner visible={loading} />
    </View>
  );
}

export default MyCooksScreen;
