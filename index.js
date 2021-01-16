'use strict';

const semver = require('semver');

const defaultModules = require('./modules');

module.exports = function (moduleName, version = '', options) {
    options = options || {};
    const env = options.env || 'development';

    if (typeof moduleName !== 'string') {
        throw new TypeError('Expected \'moduleName\' to be a string');
    }

    const modules = {
        ...defaultModules,
        ...options.modules
    };

    const isModuleAvailable = moduleName in modules;
    if (!isModuleAvailable) {
        return null;
    }

    const range = Object.keys(modules[moduleName].versions)
        .find(range => semver.satisfies(version, range));
    const config = modules[moduleName].versions[range];

    if (config == null) {
        return null;
    }

    let url = env === 'development' ? config.development : config.production;
    url = url.replace('[version]', version);
    url = url.replace('[version-seg]', options.versionSeg || '@');
    url = url.replace('[endpoint]', options.endpoint || '//unpkg.com/');
    url = url.replace('[name]', moduleName);

    return {
        name: moduleName,
        var: modules[moduleName].var,
        url,
        version
    };
};
