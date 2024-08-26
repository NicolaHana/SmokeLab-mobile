import React, { useEffect, useState } from 'react';
import {
  Image,
  View,
  Platform,
  StatusBar,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Constants from '../common/Constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StyledButton from '../components/StyledButton';
import StyledPageControl from '../components/StyledPageControl';
import Carousel from 'react-native-snap-carousel';
import ActivityItem from '../components/ActivityItem';
import ActivityHeader from '../components/ActivityHeader';
import ShareModal from '../components/ShareModal';
import BottomMenu from '../components/BottomMenu';
import StyledBackButton from '../components/StyledBackButton';
import StyledHeaderTitle from '../components/StyledHeaderTitle';
import { getFirestore, doc, collection, getDoc } from 'firebase/firestore/lite';
import moment, { max } from 'moment';
import FastImage from 'react-native-fast-image';
import ImageView from 'react-native-image-viewing';
import Spinner from '../components/Spinner';
import THEME from '../common/Theme';
import {
  capitalizeWords,
  convertActivityTimeToDate,
  getDuration,
  navigateAndReset,
} from '../common/Functions';
import Orientation from 'react-native-orientation-locker';
import ThermometerView from '../components/ThermometerView';
import { useThemeContext } from '../contexts/ThemeContext';

function CookScreen({ navigation, route }) {
  const { theme } = useThemeContext();
  const insets = useSafeAreaInsets();
  const firestore = getFirestore();
  const [cook, setCook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [visibleShareModal, setVisibleShareModal] = useState(false);
  const [imagesToView, setImagesToView] = useState([]);
  const [slideActiveIndex, setSlideActiveIndex] = useState(0);
  useEffect(() => {
    Orientation.lockToPortrait();
    return () => { };
  }, []);
  useEffect(() => {
    loadCook();
    return () => { };
  }, []);
  const onBackPress = () => {
    navigation.canGoBack() && navigation.goBack();
  };
  const onEditPress = () => {
    navigation.replace('Preparation', { id: cook.cook_id });
  };
  const onSharePress = () => {
    setVisibleShareModal(true);
  };
  const loadCook = async () => {
    try {
      setLoading(true);
      const documentSnapShot = await getDoc(
        doc(collection(firestore, 'live_cooks'), route.params.id),
      );
      setLoading(false);
      if (documentSnapShot.exists()) {
        const cook = documentSnapShot.data();
        setCook(cook);
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
  const OptionInformationView = ({
    containerStyle,
    contentStyle,
    flexDirection,
    cols,
    label,
    options,
  }) => {
    const OptionItem = ({ option }) => {
      return (
        <View style={{ flex: 1, flexDirection: flexDirection }}>
          <Text
            style={[
              styles.optionLabel,
              {
                color:
                  theme === 'light'
                    ? THEME.LIGHT_COLOR.PRIMARY
                    : THEME.DARK_COLOR.PRIMARY,
              },
            ]}>
            {`${option.label}: `}
          </Text>
          <Text
            style={[
              styles.optionValue,
              {
                color:
                  theme === 'light'
                    ? THEME.LIGHT_COLOR.TEXT_100
                    : THEME.DARK_COLOR.TEXT_100,
              },
            ]}>
            {option.value}
          </Text>
        </View>
      );
    };
    const childs = [];
    if (cols === 1) {
      options.forEach((option, index) => {
        if (option.value !== '') {
          childs.push(
            <View
              key={index.toString()}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: index === 0 ? 0 : 5,
              }}>
              <OptionItem option={option} />
            </View>,
          );
        }
      });
    } else {
      var sub = [];
      options.forEach((option, index) => {
        sub.push(<OptionItem key={index.toString()} option={option} />);
        if (index === options.length - 1 || index % 2 == 1) {
          childs.push(
            <View
              key={index.toString()}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: index === 0 || index === 1 ? 0 : 5,
              }}>
              {sub}
            </View>,
          );
          sub = [];
        }
      });
    }
    return (
      <View style={[containerStyle]}>
        <Text
          style={[
            styles.itemLabel,
            {
              color:
                theme === 'light'
                  ? THEME.LIGHT_COLOR.TEXT_INPUT_LABEL
                  : THEME.DARK_COLOR.TEXT_INPUT_LABEL,
            },
          ]}>
          {label}
        </Text>
        <View
          style={[
            styles.itemContent,
            {
              borderColor:
                theme === 'light'
                  ? THEME.LIGHT_COLOR.TEXT_INPUT_BORDER
                  : THEME.DARK_COLOR.TEXT_INPUT_BORDER,
            },
            contentStyle,
          ]}>
          {childs}
        </View>
      </View>
    );
  };
  const PlainInformationView = ({
    containerStyle,
    contentStyle,
    textStyle,
    value,
    label,
  }) => {
    return (
      <View style={[containerStyle]}>
        <Text
          style={[
            styles.itemLabel,
            {
              color:
                theme === 'light'
                  ? THEME.LIGHT_COLOR.TEXT_INPUT_LABEL
                  : THEME.DARK_COLOR.TEXT_INPUT_LABEL,
            },
          ]}>
          {label}
        </Text>
        <View
          style={[
            styles.itemContent,
            {
              borderColor:
                theme === 'light'
                  ? THEME.LIGHT_COLOR.TEXT_INPUT_BORDER
                  : THEME.DARK_COLOR.TEXT_INPUT_BORDER,
            },
            contentStyle,
          ]}>
          <Text
            style={[
              styles.itemText,
              {
                color:
                  theme === 'light'
                    ? THEME.LIGHT_COLOR.TEXT_100
                    : THEME.DARK_COLOR.TEXT_100,
              },
              textStyle,
            ]}>
            {value}
          </Text>
        </View>
      </View>
    );
  };
  const WeatherInformationView = ({ }) => {
    if (cook.meat_activities) {
      const options = [];
      cook.meat_activities.forEach(item => {
        if (
          item.activity_type === Constants.ACTIVITY_TYPE.MEAT_ON ||
          item.activity_type === Constants.ACTIVITY_TYPE.MEAT_OFF
        ) {
          let label = `M${item.activity_type.slice(
            1,
          )} (${convertActivityTimeToDate(item.activity_time).format(
            'hh:mm A',
          )})`;
          const values = [];
          if (item.activity_weather) {
            if (item.activity_weather.temp) {
              values.push(
                `${item.activity_weather.temp} ${item.activity_weather.symbol}`,
              );
            }
            if (item.activity_weather.wind) {
              values.push(`${item.activity_weather.wind} km/h`);
            }
            if (item.activity_weather.humidity) {
              values.push(`${item.activity_weather.humidity}%`);
            }
          }
          options.push({ label: label, value: values.join(', ').trim() });
        }
      });
      if (options.length === 0) {
        return null;
      }
      return (
        <OptionInformationView
          containerStyle={{ marginTop: 15 }}
          contentStyle={{}}
          label={'Weather Information'}
          flexDirection={'column'}
          cols={1}
          options={options}
        />
      );
    } else {
      return null;
    }
  };
  const TimeView = ({ type }) => {
    // function checkIsCookNextDay() {
    //   const meatOnIndex = cook.meat_activities.findIndex(
    //     activity => activity.activity_type === 'meat on',
    //   );
    //   const meatOffIndex = cook.meat_activities.findIndex(
    //     activity => activity.activity_type === 'meat off',
    //   );

    //   var isNextDay = false;
    //   var lastActivityTime = null;
    //   for (let index = meatOnIndex; index <= meatOffIndex; index++) {
    //     if (lastActivityTime === null) {
    //       lastActivityTime = cook.meat_activities[index].activity_time;
    //     } else {
    //       if (lastActivityTime > cook.meat_activities[index].activity_time) {
    //         isNextDay = true;
    //         break;
    //       }
    //     }
    //   }
    //   return isNextDay;
    // }

    // function checkIsTotalNextDay() {
    //   var isNextDay = false;
    //   var lastActivityTime = null;
    //   for (let index = 0; index < cook.meat_activities.length; index++) {
    //     if (lastActivityTime === null) {
    //       lastActivityTime = cook.meat_activities[index].activity_time;
    //     } else {
    //       if (lastActivityTime > cook.meat_activities[index].activity_time) {
    //         isNextDay = true;
    //         break;
    //       }
    //     }
    //   }
    //   return isNextDay;
    // }
    let minimum = cook?.meat_activities[0]?.activity_time;
    let maximum = cook?.meat_activities[0]?.activity_time;
    //find the minimum element in the array
    for (let i = 1; i < cook?.meat_activities?.length; i++) {
      if (cook?.meat_activities[i]?.activity_time < minimum) {
        minimum = cook?.meat_activities[i]?.activity_time;
      }
      if (cook?.meat_activities[i]?.activity_time > maximum) {
        maximum = cook?.meat_activities[i]?.activity_time;
      }
    }
    console.log('---------');
    console.log(cook.meat_activities);
    console.log('---------');
    const filteredMeatOnActivities = cook.meat_activities.filter(
      activity => activity.activity_type === 'meat on',
    );
    const meatOnActivity =
      filteredMeatOnActivities.length > 0 ? filteredMeatOnActivities[0] : null;

    const filteredMeatOffActivities = cook.meat_activities.filter(
      activity => activity.activity_type === 'meat off',
    );
    const meatOffActivity =
      filteredMeatOffActivities.length > 0
        ? filteredMeatOffActivities.slice(-1)[0]
        : null;

    // const isCookNextDay = checkIsCookNextDay();
    const cookDuration =
      meatOnActivity && meatOffActivity
        ? getDuration({
          fromTime: meatOnActivity.activity_time,
          // .replace(' PM', '')
          // .replace(' AM', ''),
          toTime: meatOffActivity.activity_time,
          // .replace(' PM', '')
          // .replace(' AM', ''),
          // isNextDay: isCookNextDay,
        })
        : { duration: 0, label: '' };

    // const isTotalNextDay = checkIsTotalNextDay(); //false;
    const totalDuration = getDuration({
      fromTime: minimum, //.replace(' PM', '').replace(' AM', ''),
      toTime: maximum, //.replace(' PM', '').replace(' AM', ''),
      // isNextDay: isTotalNextDay,
    });

    const value =
      type === 'Cook'
        ? meatOnActivity && meatOffActivity
          ? cookDuration.label
            .replace('Hours ', 'Hours\n')
            .replace('Hour ', 'Hour\n')
          : ''
        : totalDuration.duration >= cookDuration.duration
          ? totalDuration.label
            .replace('Hours ', 'Hours\n')
            .replace('Hour ', 'Hour\n')
          : '';
    return (
      <PlainInformationView
        containerStyle={{ width: (Constants.LAYOUT.SCREEN_WIDTH - 60) / 2 }}
        contentStyle={{
          minHeight: 75,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        textStyle={{
          color:
            theme === 'light'
              ? THEME.LIGHT_COLOR.PRIMARY
              : THEME.DARK_COLOR.PRIMARY,
          textAlign: 'center',
        }}
        value={value}
        label={type === 'Total' ? 'Total Time' : 'Total Cook Time'}
      />
    );
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
      <ShareModal
        visible={visibleShareModal}
        cook={cook}
        onClose={() => {
          setVisibleShareModal(false);
        }}
      />
      <ImageView
        images={imagesToView}
        imageIndex={0}
        visible={imagesToView.length > 0}
        onRequestClose={() => setImagesToView([])}
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
        <StyledHeaderTitle
          title={cook ? `${cook.cook_title}` : 'Loading...'}
          subtitle={cook ? moment(cook.cook_date).format('MM/DD/YYYY') : ''}
          containerStyle={{ alignSelf: 'center' }}
        />
        <StyledBackButton
          containerStyle={{
            position: 'absolute',
            left: 25,
            top: (Constants.LAYOUT.HEADER_HEIGHT - 24) / 2,
          }}
          onPress={onBackPress}
        />
        <TouchableOpacity
          onPress={onEditPress}
          style={{
            position: 'absolute',
            right: 25,
            top: (Constants.LAYOUT.HEADER_HEIGHT - 24) / 2,
          }}>
          <Image
            style={{
              width: 24,
              height: 24,
              tintColor:
                theme === 'light'
                  ? THEME.LIGHT_COLOR.TEXT_200
                  : THEME.DARK_COLOR.TEXT_200,
            }}
            source={require('../../assets/images/icon_edit.png')}
          />
        </TouchableOpacity>
      </View>
      {cook && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 25, paddingBottom: 15 }}
          style={{ flex: 1, marginBottom: 10 }}>
          <View>
            {cook.meat_photos && cook.meat_photos.length > 0 && (
              <View style={{ marginTop: 15 }}>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <Carousel
                    layout={'default'}
                    data={cook.meat_photos ? cook.meat_photos : []}
                    containerCustomStyle={{}}
                    loop={true}
                    renderItem={({ item, index }) => {
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            const images = [];
                            for (
                              let i = index;
                              i < index + cook.meat_photos.length;
                              i++
                            ) {
                              images.push({
                                id: index.toString(),
                                uri: cook.meat_photos[
                                  i % cook.meat_photos.length
                                ],
                              });
                            }
                            setImagesToView(images);
                          }}
                          style={{
                            width: Constants.LAYOUT.SCREEN_WIDTH - 70,
                            height: 150,
                            borderRadius: 12,
                            overflow: 'hidden',
                            backgroundColor:
                              theme === 'light'
                                ? THEME.LIGHT_COLOR.BLACK
                                : THEME.DARK_COLOR.BLACK,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <FastImage
                            resizeMode={FastImage.resizeMode.cover}
                            style={{
                              width: Constants.LAYOUT.SCREEN_WIDTH - 70,
                              height: 150,
                            }}
                            source={{
                              uri: item,
                              priority: FastImage.priority.high,
                            }}
                          />
                        </TouchableOpacity>
                      );
                    }}
                    firstItem={0}
                    sliderWidth={Constants.LAYOUT.SCREEN_WIDTH}
                    itemWidth={Constants.LAYOUT.SCREEN_WIDTH - 70}
                    itemHeight={150}
                    inactiveSlideOpacity={0.5}
                    inactiveSlideScale={0.9}
                    onSnapToItem={index => setSlideActiveIndex(index)}
                  />
                </View>
                <StyledPageControl
                  containerStyle={{ marginTop: 20 }}
                  count={cook.meat_photos ? cook.meat_photos.length : 0}
                  activeIndex={slideActiveIndex}
                  activeColor={
                    theme === 'light'
                      ? THEME.LIGHT_COLOR.PRIMARY
                      : THEME.DARK_COLOR.PRIMARY
                  }
                  inactiveColor={
                    theme === 'light'
                      ? THEME.LIGHT_COLOR.TEXT_300
                      : THEME.DARK_COLOR.TEXT_300
                  }
                />
              </View>
            )}
            <OptionInformationView
              containerStyle={{ marginTop: 15 }}
              contentStyle={{}}
              label={'Meat Information'}
              flexDirection={'column'}
              cols={1}
              options={[
                { label: 'Type', value: cook.meat_type ? cook.meat_type : '' },
                {
                  label: 'Source',
                  value: cook.meat_source ? cook.meat_source : '',
                },
                {
                  label: 'Weight',
                  value:
                    cook.meat_weight || cook.meat_weight1
                      ? [
                        cook.meat_weight
                          ? `${cook.meat_weight} ${cook.meat_weight_unit}`
                          : '',
                        cook.meat_weight1
                          ? `${cook.meat_weight1} ${cook.meat_weight_unit1}`
                          : '',
                      ]
                        .filter(item => item !== '')
                        .join(' ')
                        .trim()
                      : '',
                },
                {
                  label: 'Injection',
                  value: cook.meat_injection ? cook.meat_injection : '',
                },
                { label: 'Rub', value: cook.meat_rub ? cook.meat_rub : '' },
                {
                  label: 'Wood/Charcoal',
                  value: cook.meat_wood_charcoal ? cook.meat_wood_charcoal : '',
                },
                {
                  label: 'Smoker/Grill',
                  value: cook.meat_smoker_grill ? cook.meat_smoker_grill : '',
                },
                {
                  label: 'Theremometer',
                  value: cook.meat_thermometer ? cook.meat_thermometer : '',
                },
              ]}
            />
            {cook.meat_preparation && (
              <PlainInformationView
                containerStyle={{ marginTop: 15 }}
                contentStyle={{ minHeight: 75 }}
                value={cook.meat_preparation ? cook.meat_preparation : ''}
                label={'Preparation Information'}
              />
            )}
            {cook.meat_notes && (
              <PlainInformationView
                containerStyle={{ marginTop: 15 }}
                contentStyle={{ minHeight: 75 }}
                value={cook.meat_notes ? cook.meat_notes : ''}
                label={'Meat Notes'}
              />
            )}
            {cook.meat_ratings && (
              <OptionInformationView
                containerStyle={{ marginTop: 15 }}
                contentStyle={{}}
                label={'Rating Information'}
                flexDirection={'row'}
                cols={2}
                options={[
                  {
                    label: 'Overall Rating',
                    value: cook.meat_ratings
                      ? cook.meat_ratings.overal_rating
                      : '',
                  },
                  {
                    label: 'Appearance',
                    value: cook.meat_ratings
                      ? cook.meat_ratings.appearance
                      : '',
                  },
                  {
                    label: 'Taste',
                    value: cook.meat_ratings ? cook.meat_ratings.taste : '',
                  },
                  {
                    label: 'Tenderness',
                    value: cook.meat_ratings
                      ? cook.meat_ratings.tenderness
                      : '',
                  },
                ]}
              />
            )}
            {cook.meat_ratings_comment && (
              <PlainInformationView
                containerStyle={{ marginTop: 15 }}
                contentStyle={{ minHeight: 75 }}
                value={
                  cook.meat_ratings_comment ? cook.meat_ratings_comment : ''
                }
                label={'Rating Comments'}
              />
            )}
            {cook.meat_graph_photo && (
              <ThermometerView
                containerStyle={{ marginTop: 15 }}
                label={''}
                uri={cook.meat_graph_photo}
                onPress={() => {
                  setImagesToView([{ id: '0', uri: cook.meat_graph_photo }]);
                }}
              />
            )}
            {(cook.meat_temp_target || cook.smoker_temp_target) && (
              <OptionInformationView
                containerStyle={{ marginTop: 15 }}
                contentStyle={{}}
                label={'Target Temps'}
                flexDirection={'row'}
                cols={1}
                options={[
                  {
                    label: 'Meat Temperature',
                    value: cook.meat_temp_target
                      ? `${cook.meat_temp_target} °F`
                      : '',
                  },
                  {
                    label: 'Smoker Temperature',
                    value: cook.smoker_temp_target
                      ? `${cook.smoker_temp_target} °F`
                      : '',
                  },
                ]}
              />
            )}
            <ActivityHeader
              containerStyle={{
                marginTop: 20,
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
              }}
              editable={false}
              deletable={false}
            />
          </View>
          {cook.meat_activities && cook.meat_activities.length > 0 ? (
            cook.meat_activities.map((activity, index) => {
              return (
                <ActivityItem
                  key={index.toString()}
                  item={{
                    ...activity,
                    activity_title: capitalizeWords(activity.activity_title),
                  }}
                  editable={false}
                  deletable={false}
                  containerStyle={{
                    borderBottomLeftRadius:
                      index === cook.meat_activities.length - 1 ? 8 : 0,
                    borderBottomRightRadius:
                      index === cook.meat_activities.length - 1 ? 8 : 0,
                  }}
                />
              );
            })
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
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
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
          <View>
            <WeatherInformationView />
            {cook.meat_activities && cook.meat_activities.length >= 2 && (
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 15,
                  justifyContent: 'space-between',
                }}>
                <TimeView type={'Cook'} />
                <TimeView type={'Total'} />
              </View>
            )}
            <StyledButton
              containerStyle={{
                alignSelf: 'center',
                marginTop: 25,
                width: Constants.LAYOUT.SCREEN_WIDTH - 50,
              }}
              title={'Share My Cook'}
              onPress={onSharePress}
            />
          </View>
        </ScrollView>
      )}
      {cook && (
        <BottomMenu
          containerStyle={{ paddingBottom: insets.bottom + 15 }}
          onHomePress={() => {
            navigateAndReset({
              navigation: navigation,
              tabNavigator: 'TabHome',
              rootScreen: 'Home',
            });
          }}
          onSavePress={() => { }}
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

const styles = StyleSheet.create({
  itemContent: {
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  itemLabel: {
    fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR,
    fontSize: Constants.FONT_SIZE.FT14,
  },
  itemText: {
    fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR,
    fontSize: Constants.FONT_SIZE.FT14,
  },
  optionLabel: {
    fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR,
    fontSize: Constants.FONT_SIZE.FT14,
  },
  optionValue: {
    fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR,
    fontSize: Constants.FONT_SIZE.FT14,
  },
});

export default CookScreen;
