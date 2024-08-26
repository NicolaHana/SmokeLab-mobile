import React, { forwardRef, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  SafeAreaView,
} from 'react-native';
import Constants from '../common/Constants';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import THEME from '../common/Theme';
import { useThemeContext } from '../contexts/ThemeContext';

const StyledTimePicker = forwardRef(
  (
    {
      mode = 'date',
      initialValue,
      placeholder,
      containerStyle,
      onChangeValue,
      minimumDate = null,
      maximumDate = null,
    },
    ref,
  ) => {
    const { theme } = useThemeContext();
    const [visibleDatePicker, setVisibleDatePicker] = useState(false);
    // const [date, setDate] = useState(initialValue == '' ? null : moment(`${moment().format(Constants.DATE_FORMAT)} ${initialValue}`, Constants.DATE_TIME_FORMAT).toDate())
    const [date, setDate] = useState();
    useEffect(() => {
      return () => { };
    }, []);
    useEffect(() => {
      // if (date !== (initialValue == '' ? null : moment(`${moment().format(Constants.DATE_FORMAT)} ${initialValue}`, Constants.DATE_TIME_FORMAT).toDate())) {
      //     setDate(initialValue == '' ? null : moment(`${moment().format(Constants.DATE_FORMAT)} ${initialValue}`, Constants.DATE_TIME_FORMAT).toDate())
      // }
      setDate(initialValue ? new Date(initialValue) : null);
      return () => { };
    }, [initialValue]);
    return (
      <TouchableOpacity
        style={[styles.container, containerStyle]}
        onPress={() => {
          setVisibleDatePicker(true);
        }}>
        <Modal transparent={true} visible={visibleDatePicker}>
          <View
            style={{
              flex: 1,
              backgroundColor:
                theme === 'light'
                  ? THEME.LIGHT_COLOR.OVERLAY
                  : THEME.DARK_COLOR.OVERLAY,
            }}>
            <View
              style={{
                backgroundColor:
                  theme === 'light'
                    ? THEME.LIGHT_COLOR.BACKGROUND_100
                    : THEME.DARK_COLOR.BACKGROUND_100,
                width: Constants.LAYOUT.SCREEN_WIDTH,
                height: 34,
                position: 'absolute',
                bottom: 0,
              }}
            />
            <SafeAreaView style={{ flex: 1, justifyContent: 'flex-end' }}>
              <View
                style={{
                  width: Constants.LAYOUT.SCREEN_WIDTH,
                  height: 48,
                  backgroundColor:
                    theme === 'light'
                      ? THEME.LIGHT_COLOR.BACKGROUND_100
                      : THEME.DARK_COLOR.BACKGROUND_100,
                  flexDirection: 'row',
                  paddingHorizontal: 25,
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    const selected = date ? date : moment().toDate();
                    setDate(selected);
                    // onChangeValue(
                    //   moment(selected).format(Constants.DATE_TIME_FORMAT),
                    // );
                    onChangeValue(selected.getTime());
                    setVisibleDatePicker(false);
                  }}>
                  <Text
                    style={{
                      color:
                        theme === 'light'
                          ? THEME.LIGHT_COLOR.PRIMARY
                          : THEME.DARK_COLOR.PRIMARY,
                      fontFamily: Constants.FONT_FAMILY.PRIMARY_SEMIBOLD,
                      fontSize: Constants.FONT_SIZE.FT18,
                    }}>
                    SELECT
                  </Text>
                </TouchableOpacity>
              </View>
              <DatePicker
                date={date ? date : moment().toDate()}
                onDateChange={date => {
                  setDate(date);
                }}
                mode={'datetime'}
                theme={theme}
                minuteInterval={mode === 'time' ? null : 15}
                minimumDate={minimumDate}
                maximumDate={maximumDate}
                style={{
                  backgroundColor:
                    theme === 'light'
                      ? THEME.LIGHT_COLOR.BACKGROUND_100
                      : THEME.DARK_COLOR.BACKGROUND_100,
                  width: Constants.LAYOUT.SCREEN_WIDTH,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              />
            </SafeAreaView>
          </View>
        </Modal>
        <Text
          style={{
            fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR,
            fontSize: Constants.FONT_SIZE.FT14,
            color:
              theme === 'light'
                ? THEME.LIGHT_COLOR.TEXT_100
                : THEME.DARK_COLOR.TEXT_100,
            textAlign: 'center',
          }}>
          {date
            ? moment(date).format(Constants.DATE_TIME_DISPLAY_FORMAT)
            : placeholder}
        </Text>
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    width: (Constants.LAYOUT.SCREEN_WIDTH - 56) * 0.3,
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
});

export default StyledTimePicker;
