# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }
-keep public class com.horcrux.svg.** {*;}


# Write your keep rules here
# Keep the entry point classes
-keepclassmembers public class com.yourapp.MainApplication {
    public static void main(java.lang.String[]);
}

# Keep React Native components
-keep class com.facebook.react.bridge.** { *; }
-keep class com.facebook.react.uimanager.** { *; }

# Keep modules and packages used by React Native
-keep class com.facebook.react.** { *; }
-keep class com.facebook.flipper.** { *; }
-keep class com.facebook.soloader.** { *; }
-keep class com.facebook.yoga.** { *; }
-keep class org.webkit.** { *; }

# Keep specific packages or classes used by React Navigation
-keep class com.react.navigation.** { *; }

# Add specific ProGuard rules for each package
# Place the specific rules for each package below this line

# Sample ProGuard rules for some commonly used packages:

# React Native Geolocation
-keep class com.reactnativecommunity.geolocation.** { *; }

# React Native NetInfo
-keep class com.reactnativecommunity.netinfo.** { *; }

# React Navigation Bottom Tabs
-keep class com.reactnavigation.bottomtabs.** { *; }

# React Navigation Native
-keep class com.reactnavigation.native.** { *; }

# React Navigation Stack
-keep class com.reactnavigation.stack.** { *; }

# Deprecated React Native Prop Types
-keep class com.airbnb.android.react.proptypes.** { *; }

# Lodash
-keep class org.lodash.** { *; }

# MD5
-keep class com.github.travistx.md5.** { *; }

# Moment.js
-keep class moment.** { *; }

# React Redux
-keep class com.reactredux.** { *; }

# Redux
-keep class redux.** { *; }

# Redux Persist
-keep class com.reactredux.persist.** { *; }

# Redux Thunk
-keep class reduxthunk.** { *; }

# Keep the JNI interface for react-native-sqlcipher
-keep class net.sqlcipher.database.SQLiteDatabase { *; }

# Keep the SQLCipher-specific classes
-keep class net.sqlcipher.** { *; }

-keep class okhttp3.internal.** { *; }


-keep class b.** { *; }
-keep class g.a.** { *; }
-keep class android.support.** { *; }

-keepclassmembers class com.android.installreferrer.api.** {
  *;
}

-keep class com.google.android.gms.common.** {*;}