
/**
 * This code was generated by [react-native-codegen](https://www.npmjs.com/package/react-native-codegen).
 *
 * Do not edit this file as changes may cause incorrect behavior and will be lost
 * once the code is regenerated.
 *
 * @generated by codegen project: GeneratePropsCpp.js
 */

#include <react/renderer/components/RNDatePickerSpecs/Props.h>
#include <react/renderer/core/PropsParserContext.h>
#include <react/renderer/core/propsConversions.h>

namespace facebook::react {

RNDatePickerProps::RNDatePickerProps(
    const PropsParserContext &context,
    const RNDatePickerProps &sourceProps,
    const RawProps &rawProps): ViewProps(context, sourceProps, rawProps),

    locale(convertRawProp(context, rawProps, "locale", sourceProps.locale, {})),
    date(convertRawProp(context, rawProps, "date", sourceProps.date, {0.0})),
    maximumDate(convertRawProp(context, rawProps, "maximumDate", sourceProps.maximumDate, {0.0})),
    minimumDate(convertRawProp(context, rawProps, "minimumDate", sourceProps.minimumDate, {0.0})),
    minuteInterval(convertRawProp(context, rawProps, "minuteInterval", sourceProps.minuteInterval, {0})),
    androidVariant(convertRawProp(context, rawProps, "androidVariant", sourceProps.androidVariant, {RNDatePickerAndroidVariant::NativeAndroid})),
    mode(convertRawProp(context, rawProps, "mode", sourceProps.mode, {RNDatePickerMode::Datetime})),
    timeZoneOffsetInMinutes(convertRawProp(context, rawProps, "timeZoneOffsetInMinutes", sourceProps.timeZoneOffsetInMinutes, {})),
    fadeToColor(convertRawProp(context, rawProps, "fadeToColor", sourceProps.fadeToColor, {})),
    textColor(convertRawProp(context, rawProps, "textColor", sourceProps.textColor, {})),
    dividerHeight(convertRawProp(context, rawProps, "dividerHeight", sourceProps.dividerHeight, {0})),
    is24hourSource(convertRawProp(context, rawProps, "is24hourSource", sourceProps.is24hourSource, {RNDatePickerIs24hourSource::Device})),
    theme(convertRawProp(context, rawProps, "theme", sourceProps.theme, {RNDatePickerTheme::Auto})),
    modal(convertRawProp(context, rawProps, "modal", sourceProps.modal, {false})),
    open(convertRawProp(context, rawProps, "open", sourceProps.open, {false})),
    confirmText(convertRawProp(context, rawProps, "confirmText", sourceProps.confirmText, {})),
    cancelText(convertRawProp(context, rawProps, "cancelText", sourceProps.cancelText, {})),
    title(convertRawProp(context, rawProps, "title", sourceProps.title, {}))
      {}

} // namespace facebook::react
