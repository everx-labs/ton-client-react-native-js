import {AppRegistry} from 'react-native';

import React, {Component} from 'react';
import {View} from 'react-native';
import TONClient from 'ton-client-react-native-js';

export default class App extends Component {
    async componentDidMount() {
        const client = await TONClient.create({servers:['net.ton.dev']});
        console.log('>>>', await client.config.getVersion());
    }

    render() {
        return (<View/>);
    }

}

AppRegistry.registerComponent('test', () => App);
