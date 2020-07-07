const { spawn } = require('child_process');

function run(name, args, onOutput) {
    return new Promise((resolve, reject) => {
        try {
            const spawned = spawn(name, args, {
                env: process.env,
            });
            const errors = [];
            const output = [];

            spawned.stdout.on('data', function (data) {
                const text = data.toString();
                output.push(text);
                onOutput(text);
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

function extractReport(expect, line) {
    const pos = line.toString().indexOf(expect);
    if (pos < 0) {
        return null;
    }
    return JSON.parse(line.substr(pos + expect.length));
}

let success = 0;
let failure = 0;

function onOutputLine(line) {
    const startLog = extractReport('[TEST_START]', line);
    if (startLog) {
        return;
    }
    const successLog = extractReport('[TEST_SUCCESS]', line);
    if (successLog) {
        success += 1;
        console.log(`✓ ${successLog.name} (${success} / ${failure})`);
        return;
    }
    const failureLog = extractReport('[TEST_FAILURE]', line);
    if (failureLog) {
        failure += 1;
        console.log(`\x1b[0;31m𐄂 ${failureLog.name} (${success} / ${failure}) - ${JSON.stringify(failureLog.errors, undefined, '    ')}\x1b[m`);
        return;
    }
    const completeLog = extractReport('[TEST_COMPLETE]', line);
    if (completeLog) {
        console.log(`---`);
        console.log(`success: ${success}`);
        console.log(`failure: ${failure}`);
        process.exit(failure > 0 ? 1 : 0);
    }
}

let logText = '';

function onTestLog(text) {
    if (text.indexOf('\n') < 0) {
        logText += text;
        return;
    }
    const lines = (logText + text).split('\n');
    logText = lines[lines.length - 1];
    lines.slice(0, -1).forEach(onOutputLine);
}


async function main() {
    let runTarget = '';
    process.argv.forEach((arg) => {
        if (arg.toLowerCase() === 'ios') {
            runTarget = 'run-ios';
        } else if (arg.toLowerCase() === 'android') {
            runTarget = 'run-android';
        }
    });
    if (runTarget === '') {
        console.log('Run target missing. Use: node run-suite ios | android.');
        process.exit(1);
    }
    run('npx', ['react-native', 'start', '--reset-cache'], onTestLog).then(() => {
    }).catch((error) => {
        console.log(error);
    });
    await run('npx', ['react-native', runTarget], () => {});
}


(async () => {
    try {
        await main();
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
})();
