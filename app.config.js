const fs = require('fs');
const path = require('path');

// Helper function to write Firebase config files from environment variables
function setupFirebaseConfigs() {
  // Android google-services.json
  if (process.env.GOOGLE_SERVICES_JSON) {
    try {
      const sourcePath = process.env.GOOGLE_SERVICES_JSON;
      const androidPath = path.join(__dirname, 'google-services.json');

      // Check if it's a file path or raw content
      if (fs.existsSync(sourcePath)) {
        // It's a path, copy the file
        fs.copyFileSync(sourcePath, androidPath);
        console.log('[Firebase Config] google-services.json copied from', sourcePath);
      } else {
        // It's raw content, write it directly
        JSON.parse(sourcePath); // Validate JSON
        fs.writeFileSync(androidPath, sourcePath);
        console.log('[Firebase Config] google-services.json written from environment variable');
      }
    } catch (error) {
      console.error('[Firebase Config] Error writing google-services.json:', error.message);
      throw error;
    }
  } else if (!fs.existsSync(path.join(__dirname, 'google-services.json'))) {
    console.warn('[Firebase Config] google-services.json not found and GOOGLE_SERVICES_JSON not set');
  }

  // iOS GoogleService-Info.plist
  if (process.env.GOOGLE_SERVICE_INFO_PLIST) {
    try {
      const sourcePath = process.env.GOOGLE_SERVICE_INFO_PLIST;
      const iosPath = path.join(__dirname, 'GoogleService-Info.plist');

      // Check if it's a file path or raw content
      if (fs.existsSync(sourcePath)) {
        // It's a path, copy the file
        fs.copyFileSync(sourcePath, iosPath);
        console.log('[Firebase Config] GoogleService-Info.plist copied from', sourcePath);
      } else {
        // It's raw content, validate and write it
        if (!sourcePath.trim().startsWith('<?xml') && !sourcePath.trim().startsWith('<plist')) {
          throw new Error('Invalid plist format: does not start with XML or plist declaration');
        }
        fs.writeFileSync(iosPath, sourcePath);
        console.log('[Firebase Config] GoogleService-Info.plist written from environment variable');
      }
    } catch (error) {
      console.error('[Firebase Config] Error writing GoogleService-Info.plist:', error.message);
      throw error;
    }
  } else if (!fs.existsSync(path.join(__dirname, 'GoogleService-Info.plist'))) {
    console.warn('[Firebase Config] GoogleService-Info.plist not found and GOOGLE_SERVICE_INFO_PLIST not set');
  }
}

// Run setup when config is loaded
setupFirebaseConfigs();

module.exports = {
  expo: {
    name: "ShiftKey",
    slug: "shiftkey-app",
    version: "0.2.2",
    orientation: "portrait",
    icon: "./assets/images/adaptive-icon.jpeg",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.shiftkey.app",
      buildNumber: "27",
      googleServicesFile: "./GoogleService-Info.plist",
      infoPlist: {
        NSCameraUsageDescription: "This app uses the camera to scan QR codes for events.",
        ITSAppUsesNonExemptEncryption: false
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.jpeg",
        backgroundColor: "#ffffff"
      },
      package: "com.shiftkey.app",
      versionCode: 27,
      googleServicesFile: "./google-services.json"
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/adaptive-icon.jpeg"
    },
    plugins: [
      "expo-router",
      "expo-font",
      "@react-native-firebase/app",
      "@react-native-firebase/crashlytics",
      "./plugins/withModularHeaders"
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      router: {
        origin: false
      },
      eas: {
        projectId: "3d43e936-4b3a-4d4b-9081-201f063164b6"
      }
    }
  }
};
