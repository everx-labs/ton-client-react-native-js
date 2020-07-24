/**
 * @format
 */

import {TONClient} from 'ton-client-js';
import {initTONClient} from 'ton-client-react-native-js';

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

initTONClient(TONClient);
AppRegistry.registerComponent(appName, () => App);
