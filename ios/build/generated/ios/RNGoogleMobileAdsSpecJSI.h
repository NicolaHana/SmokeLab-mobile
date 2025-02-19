/**
 * This code was generated by [react-native-codegen](https://www.npmjs.com/package/react-native-codegen).
 *
 * Do not edit this file as changes may cause incorrect behavior and will be lost
 * once the code is regenerated.
 *
 * @generated by codegen project: GenerateModuleH.js
 */

#pragma once

#include <ReactCommon/TurboModule.h>
#include <react/bridging/Bridging.h>

namespace facebook::react {


  class JSI_EXPORT NativeGoogleMobileAdsModuleCxxSpecJSI : public TurboModule {
protected:
  NativeGoogleMobileAdsModuleCxxSpecJSI(std::shared_ptr<CallInvoker> jsInvoker);

public:
  virtual jsi::Value initialize(jsi::Runtime &rt) = 0;
  virtual jsi::Value setRequestConfiguration(jsi::Runtime &rt, std::optional<jsi::Object> requestConfiguration) = 0;
  virtual jsi::Value openAdInspector(jsi::Runtime &rt) = 0;
  virtual void openDebugMenu(jsi::Runtime &rt, jsi::String adUnit) = 0;

};

template <typename T>
class JSI_EXPORT NativeGoogleMobileAdsModuleCxxSpec : public TurboModule {
public:
  jsi::Value get(jsi::Runtime &rt, const jsi::PropNameID &propName) override {
    return delegate_.get(rt, propName);
  }

  static constexpr std::string_view kModuleName = "RNGoogleMobileAdsModule";

protected:
  NativeGoogleMobileAdsModuleCxxSpec(std::shared_ptr<CallInvoker> jsInvoker)
    : TurboModule(std::string{NativeGoogleMobileAdsModuleCxxSpec::kModuleName}, jsInvoker),
      delegate_(reinterpret_cast<T*>(this), jsInvoker) {}

private:
  class Delegate : public NativeGoogleMobileAdsModuleCxxSpecJSI {
  public:
    Delegate(T *instance, std::shared_ptr<CallInvoker> jsInvoker) :
      NativeGoogleMobileAdsModuleCxxSpecJSI(std::move(jsInvoker)), instance_(instance) {}

    jsi::Value initialize(jsi::Runtime &rt) override {
      static_assert(
          bridging::getParameterCount(&T::initialize) == 1,
          "Expected initialize(...) to have 1 parameters");

      return bridging::callFromJs<jsi::Value>(
          rt, &T::initialize, jsInvoker_, instance_);
    }
    jsi::Value setRequestConfiguration(jsi::Runtime &rt, std::optional<jsi::Object> requestConfiguration) override {
      static_assert(
          bridging::getParameterCount(&T::setRequestConfiguration) == 2,
          "Expected setRequestConfiguration(...) to have 2 parameters");

      return bridging::callFromJs<jsi::Value>(
          rt, &T::setRequestConfiguration, jsInvoker_, instance_, std::move(requestConfiguration));
    }
    jsi::Value openAdInspector(jsi::Runtime &rt) override {
      static_assert(
          bridging::getParameterCount(&T::openAdInspector) == 1,
          "Expected openAdInspector(...) to have 1 parameters");

      return bridging::callFromJs<jsi::Value>(
          rt, &T::openAdInspector, jsInvoker_, instance_);
    }
    void openDebugMenu(jsi::Runtime &rt, jsi::String adUnit) override {
      static_assert(
          bridging::getParameterCount(&T::openDebugMenu) == 2,
          "Expected openDebugMenu(...) to have 2 parameters");

      return bridging::callFromJs<void>(
          rt, &T::openDebugMenu, jsInvoker_, instance_, std::move(adUnit));
    }

  private:
    T *instance_;
  };

  Delegate delegate_;
};

} // namespace facebook::react
