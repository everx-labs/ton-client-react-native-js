/*
 * Copyright 2018-2020 TON DEV SOLUTIONS LTD.
*/

const {version} = require('./package.json');
const path = require('path');
const os = require('os');
const p = os.platform();

const bv = process.env.TON_SDK_BIN_VERSION || (version).split('.')[0];
const bp = path.resolve(os.homedir(), '.tonlabs', 'binaries', bv);
module.exports = { p, bv, bp };
