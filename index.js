/*
 * Copyright 2018-2020 TON DEV SOLUTIONS LTD.
*/

import {NativeModules} from 'react-native';
import {TONClient} from 'ton-client-js';

function initTONClient(tonClientClass) {
    tonClientClass.setLibrary({
        fetch,
        WebSocket,
        createLibrary: () => {
            return Promise.resolve(NativeModules.TONSDKForReactNative);
        },
    });
}

initTONClient(TONClient);

export {
    TONClient,
    initTONClient,
};
