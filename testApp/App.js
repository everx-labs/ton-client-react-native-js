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
import {startTests} from './suite/_/run';

class App extends Component {
    async componentDidMount() {
        await startTests(this.setState.bind(this));
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
