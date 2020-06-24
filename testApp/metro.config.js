/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const path = require('path');

module.exports = {
    transformer: {
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: false,
            },
        }),
    },
    resolver: {
        extraNodeModules: new Proxy({
            'ton-tests': path.resolve(__dirname, 'node_modules', 'ton-client-js', '__tests__'),
        }, {
            get: (target, name) => {
                //redirects dependencies referenced from common/ to local node_modules
                return name in target ? target[name] : path.join(process.cwd(), `node_modules/${name}`);
            }
        }),
    },
};
