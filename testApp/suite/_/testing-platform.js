import {initTONClient as initRN} from 'ton-client-react-native-js';
import {env, contracts} from './config';
import * as j from 'jest-lite';
import { Buffer } from 'buffer';
import * as e from 'error-polyfill';

global.Buffer = Buffer;

global.jest = j;
['test', 'run', 'expect', 'afterAll', 'afterEach', 'beforeAll', 'beforeEach'].forEach((name) => {
    global[name] = j[name];
})

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
    return contracts[`${name}-${version}`];
}

export {
    findGiverKeys,
    writeGiverKeys,
    createJaegerTracer,
    initTONClient,
    loadContractPackage,
    env,
    j as jest,
};
