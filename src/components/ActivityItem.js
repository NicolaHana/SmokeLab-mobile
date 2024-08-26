import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Constants from '../common/Constants';
import moment from 'moment';
import THEME from '../common/Theme';
import StyledTimePicker from './StyledTimePicker';
import { useThemeContext } from '../contexts/ThemeContext';
import { convertActivityTimeToDate } from '../common/Functions';

const ActivityItem = forwardRef(
  (
    {
      item,
      containerStyle,
      onFocus,
      onDeletePress,
      onChangeActivityTitle,
      onChangeActivityTime,
      editable = false,
      deletable = false,
    },
    ref,
  ) => {
    const { theme } = useThemeContext();
    const [activityTitle, setActivityTitle] = useState(item.activity_title);
    const [activityTime, setActivityTime] = useState(item.activity_time);
    const textInputRef = useRef();
    useEffect(() => {
      if (
        activityTitle !== item.activity_title ||
        activityTime !== item.activity_time
      ) {
        setActivityTitle(item.activity_title);
        setActivityTime(item.activity_time);
      }
      return () => { };
    }, [item.activity_title, item.activity_time]);
    useImperativeHandle(ref, () => ({
      focus,
    }));
    const focus = () => {
      textInputRef.current && textInputRef.current.focus();
    };
    return (
      <View
        style={[
          styles.container,
          {
            borderColor:
              theme === 'light'
                ? THEME.LIGHT_COLOR.TEXT_INPUT_BORDER
                : THEME.DARK_COLOR.TEXT_INPUT_BORDER,
          },
          containerStyle,
        ]}>
        <View
          style={[
            styles.itemContainer,
            {
              width:
                (Constants.LAYOUT.SCREEN_WIDTH - (deletable ? 54 : 53)) *
                (deletable ? 0.5 : 0.5),
            },
          ]}>
          {editable ? (
            <TextInput
              ref={textInputRef}
              keyboardType={
                item.activity_type === Constants.ACTIVITY_TYPE.TEMP
                  ? 'numbers-and-punctuation'
                  : 'default'
              }
              autoCapitalize={'words'}
              style={[
                styles.content,
                {
                  color:
                    theme === 'light'
                      ? THEME.LIGHT_COLOR.TEXT_100
                      : THEME.DARK_COLOR.TEXT_100,
                  paddingHorizontal: 10,
                },
              ]}
              value={activityTitle}
              selectionColor={
                theme === 'light'
                  ? THEME.LIGHT_COLOR.TEXT_INPUT_SELECTION_COLOR
                  : THEME.DARK_COLOR.TEXT_INPUT_SELECTION_COLOR
              }
              onFocus={onFocus}
              onChangeText={text => {
                setActivityTitle(text);
                onChangeActivityTitle(text);
              }}
            />
          ) : (
            <Text
              style={[
                styles.content,
                {
                  color:
                    theme === 'light'
                      ? THEME.LIGHT_COLOR.TEXT_100
                      : THEME.DARK_COLOR.TEXT_100,
                  height: undefined,
                  flex: 1,
                  paddingHorizontal: 10,
                },
              ]}>
              {item.activity_title}
            </Text>
          )}
        </View>
        <View
          style={[
            styles.seperator,
            {
              backgroundColor:
                theme === 'light'
                  ? THEME.LIGHT_COLOR.TEXT_INPUT_BORDER
                  : THEME.DARK_COLOR.TEXT_INPUT_BORDER,
            },
          ]}
        />
        {editable ? (
          <StyledTimePicker
            containerStyle={[
              styles.itemContainer,
              {
                width:
                  (Constants.LAYOUT.SCREEN_WIDTH - (deletable ? 54 : 53)) *
                  (deletable ? 0.35 : 0.5),
              },
            ]}
            placeholder={''}
            // initialValue={convertActivityTimeToDate(activityTime).format(
            //   Constants.DATE_TIME_FORMAT,
            // )}
            initialValue={activityTime}
            onChangeValue={value => {
              onChangeActivityTime(value);
            }}
            mode={'time'}
            icon={require('../../assets/images/icon_date.png')}
            label={''}
          />
        ) : (
          <Text
            style={{
              flex: 1,
              textAlign: 'center',
              fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR,
              fontSize: Constants.FONT_SIZE.FT14,
              color:
                theme === 'light'
                  ? THEME.LIGHT_COLOR.TEXT_100
                  : THEME.DARK_COLOR.TEXT_100,
            }}>
            {convertActivityTimeToDate(activityTime).format(
              Constants.DATE_TIME_DISPLAY_FORMAT,
            )}
          </Text>
        )}
        {deletable && (
          <View
            style={[
              styles.seperator,
              {
                backgroundColor:
                  theme === 'light'
                    ? THEME.LIGHT_COLOR.TEXT_INPUT_BORDER
                    : THEME.DARK_COLOR.TEXT_INPUT_BORDER,
              },
            ]}
          />
        )}
        {deletable && (
          <TouchableOpacity
            onPress={onDeletePress}
            style={[
              styles.itemContainer,
              { width: (Constants.LAYOUT.SCREEN_WIDTH - 54) * 0.15 },
            ]}>
            <Image
              style={{
                width: 20,
                height: 20,
                tintColor:
                  theme === 'light'
                    ? THEME.LIGHT_COLOR.DESTRUCTIVE
                    : THEME.DARK_COLOR.DESTRUCTIVE,
              }}
              source={require('../../assets/images/icon_delete.png')}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  seperator: {
    width: 1,
    height: '100%',
  },
  content: {
    alignSelf: 'center',
    fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR,
    fontSize: Constants.FONT_SIZE.FT14,
    flex: 1,
    height: '100%',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    width: (Constants.LAYOUT.SCREEN_WIDTH - 56) * 0.3,
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
});

export default ActivityItem;
