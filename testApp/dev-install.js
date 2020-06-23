
const {spawn} = require('child_process');
const fs = require('fs');
const path = require('path');

function run(name, ...args) {
    return new Promise((resolve, reject) => {
        try {
            const spawned = spawn(name, args, {
                env: {
                    ...process.env,
                    TC_BIN_SRC: path.resolve(__dirname, '..', '..', 'TON-SDK', 'ton_client', 'platforms', 'ton-client-react-native', 'build'),
                }
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

(async () => {
    for (const tgz of getTgzNames()) {
        console.log('Remove ', tgz);
        fs.unlinkSync(path.resolve(__dirname, tgz));
    }
    await run('npm', 'pack', '../../ton-client-js');
    await run('npm', 'pack', '../');
    for (const tgz of getTgzNames()) {
        console.log('Install ', tgz);
        await run('npm', 'install', tgz);
        console.log('Remove ', tgz);
        fs.unlinkSync(path.resolve(__dirname, tgz));
    }
})();


