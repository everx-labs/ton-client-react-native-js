const {spawn} = require('child_process');
const fs = require('fs');
const path = require('path');

const srcTestsPath = path.resolve(__dirname, 'node_modules', 'ton-client-js', '__tests__');
const dstTestsPath = path.resolve(__dirname, 'suite');
const coreSourcePath = path.resolve(__dirname, '..', '..', 'TON-SDK', 'ton_client');
const runEnv = {
    ...process.env,
    TC_BIN_SRC: path.resolve(coreSourcePath, 'platforms', 'ton-client-react-native', 'build'),
};

function run(name, ...args) {
    return new Promise((resolve, reject) => {
        try {
            const spawned = spawn(name, args, {
                env: runEnv,
            });
            const errors = [];
            const output = [];

            spawned.stdout.on('data', function (data) {
                output.push(data);
                process.stdout.write(data);
            });

            spawned.stderr.on('data', (data) => {
                errors.push(data);
                process.stderr.write(data.toString());
            });

            spawned.on('error', (err) => {
                reject(err);
            });

            spawned.on('close', (code) => {
                if (code === 0) {
                    resolve(output.join(''));
                } else {
                    reject(errors.join(''));
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

function getTgzNames() {
    return fs.readdirSync(__dirname)
        .filter(x => path.extname(x).toLowerCase() === '.tgz');
}

function copyTestSuiteFile(source, targetDir, convert) {
    const name = path.basename(source);
    const target = path.resolve(targetDir, name);
    const content = convert(name, fs.readFileSync(source));
    if (content !== null && content !== undefined) {
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, {recursive: true});
        }
        fs.writeFileSync(target, content);
    }
}

function copyTestSuiteFolder(sourceDir, targetDir, convert) {
    fs.readdirSync(sourceDir).forEach((file) => {
        const source = path.resolve(sourceDir, file);
        if (fs.lstatSync(source).isDirectory()) {
            copyTestSuiteFolder(source, path.resolve(targetDir, file), convert);
        } else {
            copyTestSuiteFile(source, targetDir, convert);
        }
    });
}

function copyTestSuite() {
    copyTestSuiteFolder(srcTestsPath, dstTestsPath, (name, content) => {
        const skipFile = path.extname(name).toLowerCase() !== '.js'
            || name.toLowerCase() === 'testing-platform.js';
        if (skipFile) {
            return null;
        }
        const converted = content.toString()
            .replace(/(from\s+["'])\.\.\/\.\.(\/src\/)/gm, '$1ton-client-js$2')
            .replace(/(from\s+["'])\.\.(\/src\/)/gm, '$1ton-client-js$2')
            .replace(/(from\s+["'])\.\.\/\.\.(\/types)/gm, '$1ton-client-js$2')
            .replace(/(from\s+["'])\.\.(\/types)/gm, '$1ton-client-js$2')
            .replace(/500_000_000/gm, '500000000');
        return Buffer.from(converted, 'utf8');
    });
}

function writeConfig() {
    const lines = [
        'export const env = {',
        `   USE_NODE_SE: '${process.env.USE_NODE_SE || 'true'}',`,
        `   TON_NETWORK_ADDRESS: '${process.env.TON_NETWORK_ADDRESS || 'http://0.0.0.0:8080'}',`,
        '};',
        'export const contracts = {',
    ];
    const collectContracts = (abiVersion) => {
        const dir = path.resolve(srcTestsPath, 'contracts', `abi_v${abiVersion}`);
        fs.readdirSync(dir).forEach((file) => {
            if (path.extname(file).toLowerCase() !== '.tvc') {
                return;
            }
            const name = file.slice(0, -4);
            const abi = path.resolve(dir, `${name}.abi.json`);
            const tvc = path.resolve(dir, `${name}.tvc`);
            lines.push(
                `   '${name}-${abiVersion}': {`,
                `       abi: ${fs.readFileSync(abi, 'utf8').trim().split('\n').join('').split('\t').join('')},`,
                `       imageBase64: '${fs.readFileSync(tvc).toString('base64')}',`,
                `   },`,
            );
        });
    };
    [1, 2].forEach((abiVersion) => {
        collectContracts(abiVersion);
    });
    lines.push('};')
    fs.writeFileSync(path.resolve(dstTestsPath, '_', 'config.js'), lines.join('\n'), {encoding: 'utf8'});
}

(async () => {
    writeConfig();
    copyTestSuite();

    for (const tgz of getTgzNames()) {
        console.log('Remove ', tgz);
        fs.unlinkSync(path.resolve(__dirname, tgz));
    }
    if (fs.existsSync(path.resolve(__dirname, '..', '..', 'ton-client-js'))) {
        await run('npm', 'pack', '../../ton-client-js');
    }
    await run('npm', 'pack', '../');
    for (const tgz of getTgzNames()) {
        console.log('Install ', tgz);
        await run('npm', 'install', tgz, '--no-save');
        console.log('Remove ', tgz);
        fs.unlinkSync(path.resolve(__dirname, tgz));
    }
})();


