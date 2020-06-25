import {initTONClient as initRN} from 'ton-client-react-native-js';
import * as j from 'jest-lite';
import {getState, setState} from 'jest-circus/build/state';
import { Buffer } from 'buffer';
import * as p1 from 'error-polyfill';
import * as p2  from 'react-native-console-time-polyfill';
import assets from './assets';

global.Buffer = Buffer;

global.jest = j;
['test', 'expect', 'afterAll', 'afterEach', 'beforeAll', 'beforeEach'].forEach((name) => {
    global[name] = j[name];
})

j.test.each = variants => (title, fn) => variants.forEach(v => j.test(title.replace(/%i/g, v), fn));
j.setTimeout = (timeout) => {
    const newState = {
        ...getState(),
        testTimeout: timeout,
    };
    setState(newState);
};

j.setTimeout(100000);

// platform

async function findGiverKeys() {
    return null;
}

async function writeGiverKeys(keys) {
}

function createJaegerTracer(endpoint) {
    return null;
}

async function initTONClient(tonClientClass) {
    return initRN(tonClientClass);
}

async function loadContractPackage(name, version) {
    const contract = assets.contracts[`${name}-${version}`];
    if (!contract) {
        throw new Error(`Contract not found: ${name}-${version}`)
    }
    return contract;
}

const env = assets.env;
export {
    findGiverKeys,
    writeGiverKeys,
    createJaegerTracer,
    initTONClient,
    loadContractPackage,
    env,
};
