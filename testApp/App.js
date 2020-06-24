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
import {TONMnemonicDictionary} from 'ton-client-js/src/modules/TONCryptoModule';

import {jest} from './suite/_/testing-platform';
import {tests} from './suite/_/init-tests';
import crypto from './suite/crypto.js';

class App extends Component {
    async componentDidMount() {
        try {
            await tests.init();
            jest.addEventHandler((event) => {
                if (event.name === 'test_success') {
                    this.setState({passed: (this.state.passed || 0) + 1});
                    console.log(`[TEST_SUCCESS] ${JSON.stringify({
                        name: event.test.name,
                    })}`);
                }
                if (event.name === 'test_failure') {
                    this.setState({failed: (this.state.failed || 0) + 1});
                    console.log(`[TEST_FAILURE] ${JSON.stringify({
                        name: event.test.name,
                        errors: event.test.errors,
                    })}`);
                }
            });
            const version = await tests.client.config.getVersion();
            this.setState({version});
        } catch (error) {
            console.log('>>>', error);
        }
        jest.run().then((results) => {
            results.forEach((result) => {
                result.errors = result.errors.map((e) => {
                    return e.toString().replace(/\n\s+at\s+.*/gi, '')
                });
            });
            console.log(`[TEST_COMPLETE] ${JSON.stringify(results)}`);
            this.setState({finished: true});
        })
    }

    render() {
        const state = this.state || {};
        return (
            <>
                <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                }}
                >
                    <Text style={{fontSize: 24}}>Core Version: {state.version || 'loading...'}</Text>
                    <Text style={{
                        fontSize: 24,
                        color: 'green',
                    }}>Tests Passed: {state.passed || 0}</Text>
                    <Text style={{
                        fontSize: 24,
                        color: 'red',
                    }}>Tests Failed: {state.failed || 0}</Text>
                    <Text style={{fontSize: 24}}>{state.finished ? 'Complete' : 'Testing...'}</Text>
                </View>
            </>
        );
    }
}

export default App;
