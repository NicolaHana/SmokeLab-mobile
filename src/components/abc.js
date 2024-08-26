import React, { forwardRef } from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import Constants from "../common/Constants";
import THEME from "../common/Theme";
import { useThemeContext } from "../contexts/ThemeContext";

const StyledSelectInput = forwardRef(
  (
    {
      icon = null,
      items,
      placeholder,
      label = "",
      value,
      containerStyle,
      itemStyle,
      onChangeValue,
      onFocus,
    },
    ref
  ) => {
    const { theme } = useThemeContext();
    console.log(icon);
    return (
      <View
        style={[
          styles.container,
          {
            borderColor:
              theme === "light"
                ? THEME.LIGHT_COLOR.TEXT_INPUT_BORDER
                : THEME.DARK_COLOR.TEXT_INPUT_BORDER,
            backgroundColor:
              theme === "light"
                ? THEME.LIGHT_COLOR.TEXT_INPUT_BACKGROUND
                : THEME.DARK_COLOR.TEXT_INPUT_BACKGROUND,
          },
          containerStyle,
        ]}
      >
        {label !== "" && (
          <Text
            numberOfLines={1}
            style={{
              marginBottom: 5,
              color:
                theme === "light"
                  ? THEME.LIGHT_COLOR.TEXT_INPUT_LABEL
                  : THEME.DARK_COLOR.TEXT_INPUT_LABEL,
              fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR,
              fontSize: Constants.FONT_SIZE.FT13,
            }}
          >
            {label}
          </Text>
        )}
        <View
          style={[
            styles.container,
            {
              borderColor:
                theme === "light"
                  ? THEME.LIGHT_COLOR.TEXT_INPUT_BORDER
                  : THEME.DARK_COLOR.TEXT_INPUT_BORDER,
              backgroundColor:
                theme === "light"
                  ? THEME.LIGHT_COLOR.TEXT_INPUT_BACKGROUND
                  : THEME.DARK_COLOR.TEXT_INPUT_BACKGROUND,
            },
            containerStyle,
          ]}
        >
          {icon && (
            <Image
              style={{
                position: "absolute",
                left: 15,
                width: 20,
                height: 20,
                tintColor:
                  theme === "light"
                    ? THEME.LIGHT_COLOR.TEXT_INPUT_PLACEHOLDER
                    : THEME.DARK_COLOR.TEXT_INPUT_PLACEHOLDER,
              }}
              source={icon}
            />
          )}
          <SelectDropdown
            ref={ref}
            data={items}
            onSelect={(selectedItem, index) => {
              onChangeValue(selectedItem);
            }}
            defaultButtonText={placeholder}
            buttonStyle={[
              styles.item,
              itemStyle,
              {
                borderBottomColor:
                  theme === "light"
                    ? THEME.LIGHT_COLOR.SEPERATOR
                    : THEME.DARK_COLOR.SEPERATOR,
                backgroundColor:
                  theme === "light"
                    ? THEME.LIGHT_COLOR.BACKGROUND_100
                    : THEME.DARK_COLOR.BACKGROUND_100,
                borderBottomWidth: 1,
              },
            ]}
            buttonTextStyle={[
              styles.dropdownBtnTextStyle,
              {
                color: value
                  ? theme === "light"
                    ? THEME.LIGHT_COLOR.TEXT_100
                    : THEME.DARK_COLOR.TEXT_100
                  : theme === "light"
                  ? THEME.LIGHT_COLOR.TEXT_200
                  : THEME.DARK_COLOR.TEXT_200,
                fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM,
              },
            ]}
            renderDropdownIcon={(isOpened) => (
              <Image
                style={{
                  width: 12,
                  height: 12,
                  tintColor:
                    theme === "light"
                      ? THEME.LIGHT_COLOR.TEXT_INPUT_PLACEHOLDER
                      : THEME.DARK_COLOR.TEXT_INPUT_PLACEHOLDER,
                }}
                source={require("../../assets/images/icon_down.png")}
              />
            )}
            dropdownIconPosition="right"
            buttonTextAfterSelection={(selectedItem) => {
              return selectedItem;
            }}
            rowTextForSelection={(item) => {
              return item;
            }}
            dropdownStyle={[
              styles.dropdownStyle,
              {
                backgroundColor:
                  theme === "light"
                    ? THEME.LIGHT_COLOR.BACKGROUND_100
                    : THEME.DARK_COLOR.BACKGROUND_100,
                borderColor:
                  theme === "light"
                    ? THEME.LIGHT_COLOR.SEPERATOR
                    : THEME.DARK_COLOR.SEPERATOR,
              },
            ]}
            rowStyle={styles.dropdownRowStyle}
            rowTextStyle={[
              styles.dropdownRowTextStyle,
              {
                color:
                  theme === "light"
                    ? THEME.LIGHT_COLOR.TEXT_100
                    : THEME.DARK_COLOR.TEXT_100,
              },
            ]}
          />
        </View>
      </View>
    );
  }
);
const styles = StyleSheet.create({
  // container: {

  //   height: 48,
  //   borderWidth: 1,
  //   borderRadius: 30,
  //   justifyContent: "center",
  // },
  container: {
    width: Constants.LAYOUT.SCREEN_WIDTH - 50,
    height: 48,
    // borderWidth: 1,
    // paddingLeft: 15,
    paddingRight: 15,
    justifyContent: "center",
  },
  item: {
    width: Constants.LAYOUT.SCREEN_WIDTH - 50,
    height: 48,
    paddingLeft: 20,
    paddingRight: 20,
    borderWidth: 0.2,
    justifyContent: "flex-start",
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  dropdownBtnStyle: {
    // width: Constants.LAYOUT.SCREEN_WIDTH - 50,
    // height: "100%",
    // backgroundColor: "transparent",
    // borderWidth: 0,
    // paddingLeft: 15,
  },
  dropdownBtnTextStyle: {
    textAlign: "left",

    fontSize: Constants.FONT_SIZE.FT14,
  },
  dropdownStyle: {
    borderRadius: 20,
    borderWidth: 10,
    backgroundColor: "grey",
  },
  dropdownRowStyle: {
    width: Constants.LAYOUT.SCREEN_WIDTH - 50,
    height: 40,
    borderRadius: 30,
    // backgroundColor:'red'
    // paddingLeft: 20,
    // paddingRight: 20,
    // justifyContent: "flex-start",
    // borderBottomWidth: 1,
    // borderTopColor: "red",
    // borderTopEndRadius: 30,
    // flexDirection: "row",
    // alignItems: "center",
  },
  dropdownRowTextStyle: {
    textAlign: "left",
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: Constants.FONT_SIZE.FT14,
  },
});
export default StyledSelectInput;
