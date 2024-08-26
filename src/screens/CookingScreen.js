import React, { createRef, useEffect, useRef, useState } from 'react';
import {
  View,
  Platform,
  StatusBar,
  Keyboard,
  LayoutAnimation,
  ScrollView,
  Text,
  AppState
} from 'react-native';
import Constants from '../common/Constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StyledButton from '../components/StyledButton';
import StyledTextInput from '../components/StyledTextInput';
import Spinner from '../components/Spinner';
import ActivityItem from '../components/ActivityItem';
import ActivityHeader from '../components/ActivityHeader';
import BottomMenu from '../components/BottomMenu';
import StyledBackButton from '../components/StyledBackButton';
import StyledHeaderTitle from '../components/StyledHeaderTitle';
import {
  capitalizeWords,
  navigateAndReset,
  presentAlertMessage,
} from '../common/Functions';
import {
  getFirestore,
  doc,
  collection,
  getDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore/lite';
import moment from 'moment';
import THEME from '../common/Theme';
import axios from 'axios';
import FastImage from 'react-native-fast-image';
import { useThemeContext } from '../contexts/ThemeContext';

function CookingScreen({ navigation, route }) {
  const { theme } = useThemeContext();
  const insets = useSafeAreaInsets();
  const firestore = getFirestore();
  const [loading, setLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [cook, setCook] = useState({
    id: null,
    meatTarget: '',
    smokerTarget: '',
    activities: [],
    isActive: false,
  });
  const meatTargetTextInputRef = useRef();
  const smokerTargetTextInputRef = useRef();
  const activityRefs = useRef([]);
  const cookRef = useRef(cook);
  const contentScrollViewRef = useRef();
  useEffect(() => {
    loadCook();
    return () => {
      saveCooking(cookRef.current);
    };
  }, []);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'background') {
        saveCooking(cookRef.current);
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);
  useEffect(() => {
    cookRef.current = cook;
    return () => { };
  }, [cook]);
  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      Platform.OS == 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      event => keyboardDidShow(event),
    );
    const hideSubscription = Keyboard.addListener(
      Platform.OS == 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      event => keyboardDidHide(event),
    );
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  const keyboardDidShow = event => {
    let height = event.endCoordinates.height;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setKeyboardHeight(height);
  };
  const keyboardDidHide = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setKeyboardHeight(0);
  };
  const onNextPress = async () => {
    saveCooking(cook);
    navigation.push('Result', { id: route.params.id });
  };
  const onBackPress = () => {
    navigation.canGoBack() && navigation.goBack();
  };
  const onSavePress = async () => {
    saveCooking(cook);
  };
  const loadCook = async () => {
    try {
      setLoading(true);
      const documentSnapShot = await getDoc(
        doc(collection(firestore, 'live_cooks'), route.params.id),
      );

      setLoading(false);
      if (documentSnapShot.exists()) {
        const meatActivities = documentSnapShot.data().meat_activities
          ? documentSnapShot.data().meat_activities
          : [];
        setCook(prevCook => ({
          ...prevCook,
          id: documentSnapShot.data().cook_id
            ? documentSnapShot.data().cook_id
            : null,
          meatTarget: documentSnapShot.data().meat_temp_target
            ? documentSnapShot.data().meat_temp_target
            : '',
          smokerTarget: documentSnapShot.data().smoker_temp_target
            ? documentSnapShot.data().smoker_temp_target
            : '',
          activities: meatActivities,
          isActive: documentSnapShot.data().is_active
            ? documentSnapShot.data().is_active
            : false,
        }));

        meatActivities.forEach(() => {
          activityRefs.current.push(createRef());
        });
      } else {
        setTimeout(() => {
          presentAlertMessage({
            title: 'Some problems occurred, please try again.',
          });
        }, 100);
      }
    } catch (error) {
      setLoading(false);
      console.log('loadCook:', error);
    }
  };
  const saveCooking = async cook => {
    Keyboard.dismiss();
    if (cook.id) {
      try {
        const values = {
          meat_temp_target: cook.meatTarget,
          smoker_temp_target: cook.smokerTarget,
          meat_activities: cook.activities,
          updated_at: serverTimestamp(),
        };
        await updateDoc(
          doc(collection(firestore, 'live_cooks'), route.params.id),
          values,
        );
        console.log('Cooking saved successfully!');
      } catch (error) {
        console.log('Failed to save cooking');
        throw error;
      }
    }
  };
  const loadWeather = async dt => {
    if (global.location) {
      const url = `https://api.openweathermap.org/data/3.0/onecall/timemachine?dt=${dt}&lat=${global.location.latitude}&lon=${global.location.longitude}&units=imperial&exclude=alerts,hourly,daily&appid=${Constants.WEATHER_API_KEY}`;
      try {
        if (global.weather) {
          if (Math.abs(global.weather.dt - dt) < 900) {
            return global.weather;
          } else {
            if (global.location) {
              const response = await axios.get(url);
              return response.data.data[0];
            } else {
              return null;
            }
          }
        } else {
          if (global.location) {
            const response = await axios.get(url);
            return response.data.data[0];
          } else {
            return null;
          }
        }
      } catch (error) {
        throw error;
      }
    }
  };
  const changeActivityTime = async (index, time) => {
    try {
      setLoading(true);

      const date = moment(
        `${moment(cook.cook_date).format('YYYY-MM-DD')} ${time}`,
        'YYYY-MM-DD HH:mm',
      ).toDate();
      const weather = await loadWeather(Math.floor(date.getTime() / 1000));

      global.weather = weather;

      setLoading(false);
      setCook(prevCook => ({
        ...prevCook,
        activities: prevCook.activities.map((item, i) => {
          if (i === index) {
            item.activity_time = time;
            item.activity_weather = {
              condition: weather ? weather.weather[0].main : '',
              temp: weather ? weather.temp : '',
              symbol: '°F',
              unit: 'fahrenheit',
              wind: weather ? weather.wind_speed : '',
              humidity: weather ? weather.humidity : '',
            };
          }
          return item;
        }),
      }));
    } catch (error) {
      setLoading(false);
      console.log('changeActivityTime:', error);
    }
  };
  const addActivity = async ({ activityType, activityTitle }) => {
    try {
      setLoading(true);

      let date = new Date();
      // console.log("cook_date", cook.cook_date)
      // if (!moment(cook.cook_date).isSame(moment(), 'day')) {
      //     console.log("new date?")
      //     date = new Date(cook.cook_date)
      // }

      // const activityTime = moment(date).format(Constants.DATE_TIME_FORMAT)
      const activityTime = date.getTime();

      //   console.log('activityTime', activityTime);
      const weather = await loadWeather(Math.floor(date.getTime() / 1000));

      setLoading(false);
      global.weather = weather;

      activityRefs.current.push(createRef());
      setCook(prevCook => ({
        ...prevCook,
        activities: [
          ...prevCook.activities,
          {
            activity_time: activityTime,
            activity_type: activityType,
            activity_title: activityTitle,
            activity_weather: {
              condition: weather ? weather.weather[0].main : '',
              temp: weather ? weather.temp : '',
              symbol: '°F',
              unit: 'fahrenheit',
              wind: weather ? weather.wind_speed : '',
              humidity: weather ? weather.humidity : '',
            },
          },
        ],
      }));
    } catch (error) {
      setLoading(false);
      console.log('addActivity:', error);
      throw error;
    }
  };
  const onMeatOnPress = () => {
    addActivity({
      activityType: Constants.ACTIVITY_TYPE.MEAT_ON,
      activityTitle: capitalizeWords(Constants.ACTIVITY_TYPE.MEAT_ON),
    });
  };
  const onMopPress = () => {
    addActivity({
      activityType: Constants.ACTIVITY_TYPE.MOP,
      activityTitle: capitalizeWords(Constants.ACTIVITY_TYPE.MOP),
    });
  };
  const onSprayPress = () => {
    addActivity({
      activityType: Constants.ACTIVITY_TYPE.SPRAY,
      activityTitle: capitalizeWords(Constants.ACTIVITY_TYPE.SPRAY),
    });
  };
  const onWrapPress = () => {
    addActivity({
      activityType: Constants.ACTIVITY_TYPE.WRAP,
      activityTitle: capitalizeWords(Constants.ACTIVITY_TYPE.WRAP),
    });
  };
  const onUnwrapPress = () => {
    addActivity({
      activityType: Constants.ACTIVITY_TYPE.UNWRAP,
      activityTitle: capitalizeWords(Constants.ACTIVITY_TYPE.UNWRAP),
    });
  };
  const onMeatOffPress = () => {
    addActivity({
      activityType: Constants.ACTIVITY_TYPE.MEAT_OFF,
      activityTitle: capitalizeWords(Constants.ACTIVITY_TYPE.MEAT_OFF),
    });
  };
  const onTempPress = async () => {
    try {
      await addActivity({
        activityType: Constants.ACTIVITY_TYPE.TEMP,
        activityTitle: 'Temp = ',
      });
      setTimeout(() => {
        if (activityRefs.current.length > 0) {
          const activityRef =
            activityRefs.current[activityRefs.current.length - 1];
          activityRef.current && activityRef.current.focus();
        }
      }, 200);
    } catch (error) { }
  };
  const onAddActivityPress = async () => {
    try {
      await addActivity({
        activityType: Constants.ACTIVITY_TYPE.ANY,
        activityTitle: '',
      });
      setTimeout(() => {
        if (activityRefs.current.length > 0) {
          const activityRef =
            activityRefs.current[activityRefs.current.length - 1];
          activityRef.current && activityRef.current.focus();
        }
      }, 200);
    } catch (error) { }
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor:
          theme === 'light'
            ? THEME.LIGHT_COLOR.BACKGROUND_100
            : THEME.DARK_COLOR.BACKGROUND_100,
      }}>
      <StatusBar
        barStyle={
          Platform.OS == 'ios'
            ? theme === 'dark'
              ? 'light-content'
              : 'dark-content'
            : 'light-content'
        }
        backgroundColor={
          theme === 'light' ? THEME.LIGHT_COLOR.BLACK : THEME.DARK_COLOR.BLACK
        }
      />
      <FastImage
        resizeMode={FastImage.resizeMode.cover}
        style={{
          opacity: 0.2,
          position: 'absolute',
          top: 0,
          width: Constants.LAYOUT.SCREEN_WIDTH,
          height: (Constants.LAYOUT.SCREEN_WIDTH * 1080 * 2) / 1920,
        }}
        source={require('../../assets/images/img_smoke1.png')}
      />
      <View
        style={{
          marginTop: insets.top,
          height: Constants.LAYOUT.HEADER_HEIGHT,
          justifyContent: 'center',
        }}>
        <StyledBackButton
          containerStyle={{
            position: 'absolute',
            left: 25,
            top: (Constants.LAYOUT.HEADER_HEIGHT - 24) / 2,
          }}
          onPress={onBackPress}
        />
        <StyledHeaderTitle
          title={cook.id ? 'The Cook' : 'Loading...'}
          containerStyle={{ alignSelf: 'center' }}
        />
      </View>
      {cook.id && (
        <ScrollView
          ref={contentScrollViewRef}
          keyboardShouldPersistTaps={'handled'}
          style={{ flex: 1, marginBottom: 10 }}
          contentContainerStyle={{
            paddingHorizontal: 25,
            paddingBottom:
              Platform.OS === 'ios'
                ? keyboardHeight === 0
                  ? 25
                  : keyboardHeight
                : keyboardHeight === 0
                  ? 15
                  : 0,
          }}>
          <View>
            {/* 
                            Meat Target & Smoker Target View 
                        */}
            <View
              style={{
                marginTop: 35,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <StyledTextInput
                ref={meatTargetTextInputRef}
                containerStyle={{
                  width: (Constants.LAYOUT.SCREEN_WIDTH - 50 - 10) / 2,
                }}
                placeholder={''}
                initialValue={cook.meatTarget}
                keyboardType={'numbers-and-punctuation'}
                returnKeyType={'next'}
                onChangeValue={value => {
                  setCook(prevCook => ({ ...prevCook, meatTarget: value }));
                }}
                onSubmitEditing={() => {
                  smokerTargetTextInputRef.current.focus();
                }}
                icon={require('../../assets/images/icon_temperature.png')}
                label={'Meat Target (°F)'}
              />
              <StyledTextInput
                ref={smokerTargetTextInputRef}
                containerStyle={{
                  width: (Constants.LAYOUT.SCREEN_WIDTH - 50 - 10) / 2,
                }}
                placeholder={''}
                initialValue={cook.smokerTarget}
                keyboardType={'numbers-and-punctuation'}
                returnKeyType={'next'}
                onChangeValue={value => {
                  setCook(prevCook => ({ ...prevCook, smokerTarget: value }));
                }}
                onSubmitEditing={() => {
                  Keyboard.dismiss();
                }}
                icon={require('../../assets/images/icon_temperature.png')}
                label={'Smoker Target (°F)'}
              />
            </View>
            {/* 
                            Meat ON button
                        */}
            <StyledButton
              containerStyle={{
                marginTop: 20,
                width: Constants.LAYOUT.SCREEN_WIDTH - 50,
                height: 50,
                borderRadius: 25,
              }}
              textStyle={{
                fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD,
                fontSize: Constants.FONT_SIZE.FT16,
                color:
                  theme === 'light'
                    ? THEME.LIGHT_COLOR.WHITE
                    : THEME.DARK_COLOR.WHITE,
              }}
              title={'MEAT ON!'}
              onPress={onMeatOnPress}
            />
            {/* 
                            Mop & Spray Button
                        */}
            <View
              style={{
                marginTop: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <StyledButton
                containerStyle={{
                  width: (Constants.LAYOUT.SCREEN_WIDTH - 50 - 10) / 2,
                  height: 50,
                  borderRadius: 25,
                }}
                textStyle={{
                  fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD,
                  fontSize: Constants.FONT_SIZE.FT16,
                  color:
                    theme === 'light'
                      ? THEME.LIGHT_COLOR.WHITE
                      : THEME.DARK_COLOR.WHITE,
                }}
                iconStyle={{}}
                title={'Mop'}
                icon={require('../../assets/images/icon_mop.png')}
                onPress={onMopPress}
              />
              <StyledButton
                containerStyle={{
                  width: (Constants.LAYOUT.SCREEN_WIDTH - 50 - 10) / 2,
                  height: 50,
                  borderRadius: 25,
                }}
                textStyle={{
                  fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD,
                  fontSize: Constants.FONT_SIZE.FT16,
                  color:
                    theme === 'light'
                      ? THEME.LIGHT_COLOR.WHITE
                      : THEME.DARK_COLOR.WHITE,
                }}
                iconStyle={{}}
                title={'Spray'}
                icon={require('../../assets/images/icon_spray.png')}
                onPress={onSprayPress}
              />
            </View>
            {/* 
                            Wrap & Unwrap Button
                        */}
            <View
              style={{
                marginTop: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <StyledButton
                containerStyle={{
                  width: (Constants.LAYOUT.SCREEN_WIDTH - 50 - 10) / 2,
                  height: 50,
                  borderRadius: 25,
                }}
                textStyle={{
                  fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD,
                  fontSize: Constants.FONT_SIZE.FT16,
                  color:
                    theme === 'light'
                      ? THEME.LIGHT_COLOR.WHITE
                      : THEME.DARK_COLOR.WHITE,
                }}
                iconStyle={{}}
                title={'Wrap'}
                icon={require('../../assets/images/icon_wrap.png')}
                onPress={onWrapPress}
              />
              <StyledButton
                containerStyle={{
                  width: (Constants.LAYOUT.SCREEN_WIDTH - 50 - 10) / 2,
                  height: 50,
                  borderRadius: 25,
                }}
                textStyle={{
                  fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD,
                  fontSize: Constants.FONT_SIZE.FT16,
                  color:
                    theme === 'light'
                      ? THEME.LIGHT_COLOR.WHITE
                      : THEME.DARK_COLOR.WHITE,
                }}
                iconStyle={{}}
                title={'Unwrap'}
                icon={require('../../assets/images/icon_unwrap.png')}
                onPress={onUnwrapPress}
              />
            </View>
            {/* 
                            Add Activity Button
                        */}
            <StyledButton
              containerStyle={{
                marginTop: 10,
                width: Constants.LAYOUT.SCREEN_WIDTH - 50,
                height: 50,
                borderRadius: 25,
              }}
              textStyle={{
                fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD,
                fontSize: Constants.FONT_SIZE.FT16,
                color:
                  theme === 'light'
                    ? THEME.LIGHT_COLOR.WHITE
                    : THEME.DARK_COLOR.WHITE,
              }}
              title={'Add Activity'}
              onPress={onAddActivityPress}
            />
            {/**
             * Temp Button
             */}
            <StyledButton
              containerStyle={{
                marginTop: 10,
                width: Constants.LAYOUT.SCREEN_WIDTH - 50,
                height: 50,
                borderRadius: 25,
              }}
              textStyle={{
                fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD,
                fontSize: Constants.FONT_SIZE.FT16,
                color:
                  theme === 'light'
                    ? THEME.LIGHT_COLOR.WHITE
                    : THEME.DARK_COLOR.WHITE,
              }}
              title={'Temp'}
              icon={require('../../assets/images/icon_temp.png')}
              onPress={onTempPress}
            />
            <ActivityHeader
              containerStyle={{
                marginTop: 10,
                borderTopLeftRadius: 25,
                borderTopRightRadius: 25,
              }}
              editable={false}
              deletable={!cook.isActive}
            />
          </View>
          {cook.activities.length > 0 ? (
            cook.activities.map((activity, index) => (
              <ActivityItem
                ref={activityRefs.current[index]}
                key={index.toString()}
                containerStyle={{
                  borderBottomLeftRadius:
                    index === cook.activities.length - 1 ? 25 : 0,
                  borderBottomRightRadius:
                    index === cook.activities.length - 1 ? 25 : 0,
                }}
                item={
                  cook.isActive
                    ? {
                      ...activity,
                      activity_title: capitalizeWords(
                        activity.activity_title,
                      ),
                    }
                    : activity
                }
                deletable={!cook.isActive}
                editable={
                  !cook.isActive &&
                  activity.activity_type !== Constants.ACTIVITY_TYPE.MEAT_ON &&
                  activity.activity_type !== Constants.ACTIVITY_TYPE.MEAT_OFF
                }
                onFocus={() => {
                  setTimeout(() => {
                    contentScrollViewRef.current.scrollToEnd({ animated: true });
                  }, 500);
                }}
                onChangeActivityTitle={text => {
                  setCook(prevCook => ({
                    ...prevCook,
                    activities: prevCook.activities.map((item, i) => {
                      if (i === index) {
                        item.activity_title = text;
                      }
                      return item;
                    }),
                  }));
                }}
                onChangeActivityTime={time => {
                  changeActivityTime(index, time);
                }}
                onEditTimePress={() => { }}
                onDeletePress={() => {
                  setCook(prevCook => ({
                    ...prevCook,
                    activities: prevCook.activities.filter(
                      (_, i) => index !== i,
                    ),
                  }));
                  activityRefs.current.splice(index, 1);
                }}
              />
            ))
          ) : (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 10,
                borderColor:
                  theme === 'light'
                    ? THEME.LIGHT_COLOR.TEXT_INPUT_BORDER
                    : THEME.DARK_COLOR.TEXT_INPUT_BORDER,
                borderBottomWidth: 1,
                borderLeftWidth: 1,
                borderRightWidth: 1,
                borderBottomLeftRadius: 25,
                borderBottomRightRadius: 25,
              }}>
              <Text
                style={{
                  color:
                    theme === 'light'
                      ? THEME.LIGHT_COLOR.TEXT_200
                      : THEME.DARK_COLOR.TEXT_200,
                  fontSize: Constants.FONT_SIZE.FT14,
                  fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR,
                }}>
                {'No activities'}
              </Text>
            </View>
          )}
          {/**
           * Meat Off & Next(The Results) Buttons
           */}
          <View>
            <StyledButton
              containerStyle={{
                marginTop: 20,
                width: Constants.LAYOUT.SCREEN_WIDTH - 50,
                height: 50,
                borderRadius: 25,
              }}
              textStyle={{
                fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD,
                fontSize: Constants.FONT_SIZE.FT16,
                color:
                  theme === 'light'
                    ? THEME.LIGHT_COLOR.WHITE
                    : THEME.DARK_COLOR.WHITE,
              }}
              title={'MEAT OFF!'}
              onPress={onMeatOffPress}
            />
            <View
              style={{
                marginTop: 15,
                marginBottom: 15,
                height: 1,
                width: Constants.LAYOUT.SCREEN_WIDTH - 50,
                backgroundColor:
                  theme === 'light'
                    ? THEME.LIGHT_COLOR.SEPERATOR
                    : THEME.DARK_COLOR.SEPERATOR,
              }}
            />
            <StyledButton
              containerStyle={{
                alignSelf: 'center',
                width: Constants.LAYOUT.SCREEN_WIDTH - 50,
              }}
              title={'Next (The Results)'}
              onPress={onNextPress}
            />
          </View>
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
              tabNavigator: 'TabHome',
              rootScreen: 'Home',
            });
          }}
          onSavePress={onSavePress}
          onLibraryPress={() => {
            navigateAndReset({
              navigation: navigation,
              tabNavigator: 'TabLibrary',
              rootScreen: 'Library',
            });
          }}
          onProfilePress={() => {
            navigation.navigate('TabSettings');
          }}
        />
      )}
      <Spinner visible={loading} />
    </View>
  );
}

export default CookingScreen;
