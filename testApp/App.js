/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {
    View,
    Text,
} from 'react-native';
import {TONClient} from 'ton-client-js';
import initTests from 'ton-client-js/__tests__/_/init-tests';

class App extends Component {
    async componentDidMount() {
        try {
            console.log('>>>', TONClient);
            this.client = await TONClient.create({ servers: ['net.ton.dev']});
            const version = await this.client.config.getVersion();
            const accounts = await this.client.queries.accounts.query({
                filter: {},
                result: 'id balance(format:DEC)'
            })
            console.log('>>>', accounts);
            this.setState({ version });
        } catch (error) {
            console.log('>>>', error);
        }
    }

    render() {
        const state = this.state || {
            version: 'loading...',
        };
        return (
            <>
                <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1
                }}
                >
                    <Text style={{ fontSize: 24 }}>TON Client Tests</Text>
                    <Text style={{ fontSize: 24 }}>Version: {state.version}</Text>
                </View>
            </>
        );
    }
}

export default App;
