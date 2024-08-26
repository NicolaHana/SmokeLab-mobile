// import React, { forwardRef, useState } from "react";
// import {
//   View,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   Text,
//   ScrollView,
// } from "react-native";
// import Constants from "../common/Constants";
// import { Menu } from "react-native-material-menu";
// import THEME from "../common/Theme";
// import { useThemeContext } from "../contexts/ThemeContext";

// const StyledSelectInput = forwardRef(
//   (
//     {
//       icon = null,
//       items,
//       placeholder,
//       label = "",
//       value,
//       containerStyle,
//       itemStyle,
//       onChangeValue,
//       onFocus,
//     },
//     ref
//   ) => {
//     const { theme } = useThemeContext();
//     const [visibleMenu, setVisibleMenu] = useState(false);

//     console.log("visibleMenu", visibleMenu);
//     return (
//       <Menu
//         ref={ref}
//         visible={visibleMenu}
//         anchor={
//           <TouchableOpacity
//             onPress={() => {
//               setVisibleMenu(true);
//               onFocus();
//             }}
//             style={[
//               styles.container,
//               {
//                 borderColor:
//                   theme === "light"
//                     ? THEME.LIGHT_COLOR.TEXT_INPUT_BORDER
//                     : THEME.DARK_COLOR.TEXT_INPUT_BORDER,
//                 backgroundColor:
//                   theme === "light"
//                     ? THEME.LIGHT_COLOR.TEXT_INPUT_BACKGROUND
//                     : THEME.DARK_COLOR.TEXT_INPUT_BACKGROUND,
//               },
//               containerStyle,
//             ]}
//           >
//             {icon && (
//               <Image
//                 style={{
//                   position: "absolute",
//                   left: 15,
//                   width: 20,
//                   height: 20,
//                   tintColor: visibleMenu
//                     ? theme === "light"
//                       ? THEME.LIGHT_COLOR.PRIMARY
//                       : THEME.DARK_COLOR.PRIMARY
//                     : theme === "light"
//                     ? THEME.LIGHT_COLOR.TEXT_INPUT_PLACEHOLDER
//                     : THEME.DARK_COLOR.TEXT_INPUT_PLACEHOLDER,
//                 }}
//                 source={icon}
//               />
//             )}
//             {label !== "" && (
//               <Text
//                 numberOfLines={1}
//                 style={{
//                   position: "absolute",
//                   top: -25,
//                   left: 0,
//                   color:
//                     theme === "light"
//                       ? THEME.LIGHT_COLOR.TEXT_INPUT_LABEL
//                       : THEME.DARK_COLOR.TEXT_INPUT_LABEL,
//                   fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR,
//                   fontSize: Constants.FONT_SIZE.FT13,
//                 }}
//               >
//                 {label}
//               </Text>
//             )}
//             <Text
//               numberOfLines={1}
//               style={{
//                 color:
//                   value === ""
//                     ? theme === "light"
//                       ? THEME.LIGHT_COLOR.TEXT_200
//                       : THEME.DARK_COLOR.TEXT_200
//                     : theme === "light"
//                     ? THEME.LIGHT_COLOR.TEXT_100
//                     : THEME.DARK_COLOR.TEXT_100,
//                 fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM,
//                 fontSize: Constants.FONT_SIZE.FT14,
//                 marginLeft: icon ? 30 : 0,
//               }}
//             >
//               {value == "" ? placeholder : value}
//             </Text>
//             <View style={{ position: "absolute", right: 15 }}>
//               <Image
//                 style={{
//                   width: 12,
//                   height: 12,
//                   tintColor:
//                     theme === "light"
//                       ? THEME.LIGHT_COLOR.TEXT_INPUT_PLACEHOLDER
//                       : THEME.DARK_COLOR.TEXT_INPUT_PLACEHOLDER,
//                 }}
//                 source={require("../../assets/images/icon_down.png")}
//               />
//             </View>
//           </TouchableOpacity>
//         }
//         onRequestClose={() => setVisibleMenu(false)}
//         style={{
//           maxHeight: 250,
//           marginTop:
//             48 +
//             (containerStyle && containerStyle.marginTop
//               ? containerStyle.marginTop
//               : 0),
//           borderRadius:
//             containerStyle && containerStyle.borderRadius
//               ? containerStyle.borderRadius
//               : 10,
//           borderWidth: 1,
//           borderColor:
//             theme === "light"
//               ? THEME.LIGHT_COLOR.SEPERATOR
//               : THEME.DARK_COLOR.SEPERATOR,
//           overflow: "hidden",
//           backgroundColor:
//             theme === "light"
//               ? THEME.LIGHT_COLOR.BACKGROUND_100
//               : THEME.DARK_COLOR.BACKGROUND_100,
//         }}
//       >
//         <ScrollView style={{}}>
//           {items.map((item, index) => {
//             return (
//               <TouchableOpacity
//                 style={[
//                   styles.item,
//                   itemStyle,
//                   {
//                     borderBottomColor:
//                       theme === "light"
//                         ? THEME.LIGHT_COLOR.SEPERATOR
//                         : THEME.DARK_COLOR.SEPERATOR,
//                     backgroundColor:
//                       theme === "light"
//                         ? THEME.LIGHT_COLOR.BACKGROUND_100
//                         : THEME.DARK_COLOR.BACKGROUND_100,
//                     borderBottomWidth: index === items.length - 1 ? 0 : 1,
//                   },
//                 ]}
//                 key={index.toString()}
//                 onPress={() => {
//                   setVisibleMenu(false);
//                   onChangeValue(item);
//                 }}
//               >
//                 <Text
//                   numberOfLines={1}
//                   style={{
//                     color:
//                       theme === "light"
//                         ? THEME.LIGHT_COLOR.TEXT_100
//                         : THEME.DARK_COLOR.TEXT_100,
//                     fontSize: Constants.FONT_SIZE.FT14,
//                     fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM,
//                   }}
//                 >
//                   {item}
//                 </Text>
//               </TouchableOpacity>
//             );
//           })}
//         </ScrollView>
//       </Menu>
//     );
//   }
// );

// const styles = StyleSheet.create({
//   container: {
//     width: Constants.LAYOUT.SCREEN_WIDTH - 50,
//     height: 48,
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingLeft: 15,
//     paddingRight: 15,
//     justifyContent: "center",
//   },
//   item: {
//     width: Constants.LAYOUT.SCREEN_WIDTH - 50,
//     height: 40,
//     paddingLeft: 20,
//     paddingRight: 20,
//     justifyContent: "flex-start",
//     borderBottomWidth: 1,
//     flexDirection: "row",
//     alignItems: "center",
//   },
// });

// export default StyledSelectInput;

import React, { forwardRef, useState } from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import Constants from "../common/Constants";
import THEME from "../common/Theme";
import { useThemeContext } from "../contexts/ThemeContext";

const StyledSelectInput = forwardRef(
  (
    {
      icon = null, // Example icon
      items,
      placeholder,
      label = "",
      value,
      containerStyle,
      itemStyle,
      onChangeValue,
      marginLeft,
    },
    ref
  ) => {
    const styles = StyleSheet.create({
      container: {
        width: Constants.LAYOUT.SCREEN_WIDTH - 50,
      },
      label: {
        // marginBottom: 5,
        fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR,
        fontSize: Constants.FONT_SIZE.FT13,
      },
      dropdownBtnStyle: {
        width: "100%",
        height: 50,
        borderRadius: 8,
        borderWidth: 1,
        paddingHorizontal: 15,
        justifyContent: "center",
      },
      dropdownBtnTextStyle: {
        marginLeft: marginLeft,
        textAlign: "left",
        fontSize: Constants.FONT_SIZE.FT14,
      },
      iconStyle: {
        width: 12,
        height: 12,
      },
      dropdownRowStyle: {
        height: 40,
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: "lightgrey",
      },
      dropdownRowTextStyle: {
        textAlign: "left",
        fontSize: Constants.FONT_SIZE.FT14,
        paddingHorizontal: 20,
      },
    });
    const [visibleMenu, setVisibleMenu] = useState(false);
    const { theme } = useThemeContext();
    console.log();
    return (
      <View style={[styles.container, containerStyle]}>
        {label !== "" && (
          <Text
            numberOfLines={1}
            style={[
              styles.label,
              {
                color:
                  theme === "light"
                    ? THEME.LIGHT_COLOR.TEXT_INPUT_LABEL
                    : THEME.DARK_COLOR.TEXT_INPUT_LABEL,
              },
            ]}
          >
            {label}
          </Text>
        )}

        <SelectDropdown
          ref={ref}
          data={items}
          onSelect={(selectedItem) => {
            onChangeValue(selectedItem);
            setVisibleMenu(false);
          }}
          onFocus={() => setVisibleMenu(true)}
          defaultButtonText={placeholder}
          buttonStyle={[
            styles.dropdownBtnStyle,
            {
              backgroundColor:
                theme === "light"
                  ? THEME.LIGHT_COLOR.TEXT_INPUT_BACKGROUND
                  : THEME.DARK_COLOR.TEXT_INPUT_BACKGROUND,
              borderColor:
                theme === "light"
                  ? THEME.LIGHT_COLOR.TEXT_INPUT_BORDER
                  : THEME.DARK_COLOR.TEXT_INPUT_BORDER,
            },
            containerStyle,
            itemStyle,
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
            },
          ]}
          renderDropdownIcon={(isOpened) => (
            <>
              {icon && (
                <Image
                  style={{
                    position: "absolute",
                    left: 15,
                    width: 20,
                    height: 20,
                    tintColor: visibleMenu
                      ? theme === "light"
                        ? THEME.LIGHT_COLOR.PRIMARY
                        : THEME.DARK_COLOR.PRIMARY
                      : theme === "light"
                      ? THEME.LIGHT_COLOR.TEXT_INPUT_PLACEHOLDER
                      : THEME.DARK_COLOR.TEXT_INPUT_PLACEHOLDER,
                  }}
                  source={icon}
                />
              )}
              <Image
                style={[
                  styles.iconStyle,
                  {
                    tintColor:
                      theme === "light"
                        ? THEME.LIGHT_COLOR.TEXT_INPUT_PLACEHOLDER
                        : THEME.DARK_COLOR.TEXT_INPUT_PLACEHOLDER,
                  },
                ]}
                source={require("../../assets/images/icon_down.png")}
              />
            </>
          )}
          dropdownIconPosition="right"
          buttonTextAfterSelection={(selectedItem) => {
            return selectedItem;
          }}
          rowTextForSelection={(item) => {
            return item;
          }}
          dropdownStyle={{
            backgroundColor:
              theme === "light"
                ? THEME.LIGHT_COLOR.BACKGROUND_100
                : THEME.DARK_COLOR.BACKGROUND_100,
            borderColor:
              theme === "light"
                ? THEME.LIGHT_COLOR.SEPERATOR
                : THEME.DARK_COLOR.SEPERATOR,
            borderRadius:
              containerStyle && containerStyle.borderRadius
                ? containerStyle.borderRadius
                : 10,
          }}
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
    );
  }
);

export default StyledSelectInput;
