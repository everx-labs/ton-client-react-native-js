# ton-client-react-native-js

TON Labs Client Library for React Native

See [https://docs.ton.dev/86757ecb2/p/92b041-overview](https://docs.ton.dev/86757ecb2/p/92b041-overview) for documentation

![npm publish](https://github.com/tonlabs/ton-client-react-native-js/workflows/npm%20publish/badge.svg)

---
Copyright 2018-2020 TON DEV SOLUTIONS LTD.

# Install

```shell script
npm install react-native-client-js
```

# Test

This project contains the `testApp` that runs the main test suite from `ton-client-js`.

Test environment for iOS:

- Xcode (latest version)
- NodeJs (at least 12)

Test environment for Android:

- Android Studio with emulator
- NodeJs (at least 12)

Run tests:

```shell script
cd testApp
npm install
node prepare-suite.js
node run-suite.js ios
node run-suite.js android
```
