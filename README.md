# ton-client-react-native-js

TON Labs Client Library for React Native

See https://docs.ton.dev for documentation

![npm publish](https://github.com/tonlabs/ton-client-react-native-js/workflows/npm%20publish/badge.svg)

---
Copyright 2018-2020 TON DEV SOLUTIONS LTD.

Licensed under the SOFTWARE EVALUATION License (the "License"); you may not use
this file except in compliance with the License.

You may obtain a copy of the License at: https://www.ton.dev/licenses

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific TON DEV software governing permissions and
limitations under the License.

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
node prepare-tests.js
node test-ios.js
node test-android.js
```

