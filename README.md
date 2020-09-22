# TON Javascript React-Native SDK
[![npm publish](https://github.com/tonlabs/ton-client-react-native-js/workflows/npm%20publish/badge.svg)](https://www.npmjs.com/package/ton-client-react-native-js)


## Community links:

[![Chat on Telegram](https://img.shields.io/badge/chat-on%20telegram-9cf.svg)](https://t.me/ton_sdk)  [![Gitter](https://badges.gitter.im/ton-sdk/community.svg)](https://gitter.im/ton-sdk/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

## Documentation

[GraphQL API and SDK documentation](https://docs.ton.dev/86757ecb2/p/92b041-overview)

The JavaScript SDK implements the client-side libraries used by applications working with TON OS GraphQL API.  
This package supports web (browser), mobile-web, and server (Node.js) clients. 

[Common Javascript SDK](https://github.com/tonlabs/ton-client-js) is distributed via [npm package](https://www.npmjs.com/package/ton-client-js).



**Attention!** Because the JS library uses pre-compiled [core sdk rust library](https://github.com/tonlabs/TON-SDK), you need to 
install it via platform-dependable [react-native package](https://www.npmjs.com/package/ton-client-react-native-js)  that will automatically 
install common js package +  download and link pre-compiled rust core to your project:

```shell script
npm install ton-client-react-native-js

```

To get started using TON Javascript SDK, see [Add SDK to your Application](https://docs.ton.dev/86757ecb2/p/61b5eb-nodejs).


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

---
Copyright 2018-2020 TON DEV SOLUTIONS LTD.
