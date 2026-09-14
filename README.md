# cordova-plugin-VoIpUSSD

A Cordova plugin version of [VoIpUSSD](https://github.com/romellfudi/VoIpUSSD) that places USSD calls from a Cordova app and reads the USSD response back into JavaScript.

## Features

* Place a USSD call (e.g. `*105#`) from JavaScript with a single `show()` call.
* Read the USSD response text back into the success callback.
* Automatically answers the first two USSD menu options with `1`.
* Handles the Android `CALL_PHONE` / `READ_PHONE_STATE` runtime permission flow.
* Uses an Android Accessibility Service to read the USSD dialog, so no root access is required.

## Installation

```
cordova plugin add https://github.com/rmxakalogistik/cordova-plugin-VoIpUSSD.git
```

## Configuration

### On *AndroidManifest.xml* file

* Add service:
```
<service android:name="com.ramymokako.plugin.ussd.android.USSDService" android:permission="android.permission.BIND_ACCESSIBILITY_SERVICE">
    <intent-filter>
           <action android:name="android.accessibilityservice.AccessibilityService" />
    </intent-filter>
    <meta-data android:name="android.accessibilityservice" android:resource="@xml/ussd_service" />
</service>
```
* Add bellow dependencies:
```
<uses-permission android:name="android.permission.CALL_PHONE" />
<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
<uses-permission android:name="android.permission.READ_PHONE_STATE" />
```

### On *res/xml/* folder

* Create empty **ussd_service.xml** file and insert bellow:
```
<?xml version="1.0" encoding="utf-8"?>
<accessibility-service xmlns:android="http://schemas.android.com/apk/res/android"
    android:accessibilityEventTypes
        ="typeWindowStateChanged"
    android:packageNames="com.android.phone"
    android:accessibilityFeedbackType="feedbackGeneric"
    android:accessibilityFlags="flagDefault"
    android:canRetrieveWindowContent="true"
    android:notificationTimeout="0"/>
<!--|typeViewTextChanged-->
```

## Usage

```
window.plugins.voIpUSSD.show('*105#', function (data) {
   console.log('USSD Success: ' + data);
}, function (err) {
   console.log('USSD Erreur: ' + err);
});
```

The error callback receives a structured JSON object `{ code, message }` when the
plugin itself rejects the input (e.g. an empty `ussdCode`), and a plain string
for errors raised by the native layer.

## Architecture

The plugin is split into a thin JavaScript bridge and a native Android layer:

```
www/voIpUSSD.js          JS bridge: registers window.plugins.voIpUSSD and
                         forwards show() to cordova.exec
        |
        | cordova.exec('VoIpUSSD', 'show', [{ ussdCode }])
        v
src/android/VoIpUSSD.java        CordovaPlugin entry point: parses arguments,
                                 validates the USSD code, checks permissions
src/android/USSDController.java  Singleton that dials the USSD number and
                                 dispatches responses to callbacks
src/android/USSDService.java     AccessibilityService that watches the USSD
                                 dialog, reads the response text and sends
                                 menu selections back
src/android/USSDLog.java         Centralized logging wrapper (single tag,
                                 easy to disable in release builds)
```

Flow: `show()` -> `cordova.exec` -> `VoIpUSSD.execute()` -> `USSDController.callUSSDInvoke()`
-> Android dialer opens the USSD session -> `USSDService` reads the dialog text and
feeds it back through the `CallbackInvoke` / `CallbackMessage` callbacks -> the
accumulated response is returned to the JavaScript success callback.

## Testing

The JavaScript bridge is covered by a Jest suite that stubs `cordova` and asserts
the exact arguments passed to `cordova.exec`:

```
npm install
npm test
```

Lint the JS bridge with:

```
npm run lint
```

The native validation logic (`USSDController.validateDialUpArguments`) has a plain
JUnit4 test under `src/androidTest/` that runs on a JVM without an emulator.

## Contributing

1. Fork the repository and create a feature branch.
2. Keep changes small and focused; commit tests together with the code they cover.
3. Run `npm test` and `npm run lint` before opening a pull request.
4. Open a pull request describing the change and the verification you ran.

## Authors

* **Ramy Mokako** - *Initial work* - [Romell Domínguez](https://github.com/romellfudi/VoIpUSSD/#by-romell-dominguez)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.