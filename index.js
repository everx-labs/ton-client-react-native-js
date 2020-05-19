/*
 * Copyright 2018-2020 TON DEV SOLUTIONS LTD.
*/

import {NativeModules} from 'react-native';
import {TONClient} from 'ton-client-js';

TONClient.setLibrary({
    fetch,
    WebSocket,
    createLibrary: () => {
        return Promise.resolve(NativeModules.TONSDKForReactNative);
    },
});

export default {
    TONClient
};
