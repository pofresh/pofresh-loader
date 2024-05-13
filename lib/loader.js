/**
 * Loader Module
 */

const fs = require('fs');
const ph = require('path');

/**
 * Load modules under the path.
 * If the module is a function, loader would treat it as a factory function
 * and invoke it with the context parameter to get a instance of the module.
 * Else loader would just require the module.
 * Module instance can specify a name property and it would use file name as
 * the default name if there is no name property. All loaded modules under the
 * path would be add to an empty root object with the name as the key.
 *
 * @param  {String} mpath    the path of modules. Load all the files under the
 *                           path, but *not* recursively if the path contain
 *                           any sub-directory.
 * @param  {Object} context  the context parameter that would be pass to the
 *                           module factory function.
 * @return {Object}          module that has loaded.
 */
module.exports.load = function (mpath, context) {
    if (!mpath) {
        throw new Error('path should not be empty.');
    }

    try {
        mpath = fs.realpathSync(mpath);
    } catch (err) {
        throw err;
    }

    if (!fs.statSync(mpath).isDirectory()) {
        throw new Error('path should be directory.');
    }

    return loadPath(mpath, context);
};

function loadPath(path, context) {
    let files = fs.readdirSync(path);
    if (files.length === 0) {
        console.warn('path is empty, path:', path);
        return;
    }

    let fp, fn, m, res = {};
    for (let i = 0, l = files.length; i < l; i++) {
        fn = files[i];
        fp = ph.join(path, fn);
        if (!fs.statSync(fp).isFile() || ph.extname(fn) !== '.js') {
            // only load js file type
            continue;
        }

        m = loadFile(fp, context);

        if (!m) {
            continue;
        }
        let name = m.name || ph.basename(fn, '.js');
        res[name] = m;
    }

    return res;
}

function loadFile(fp, context) {
    let m = requireUncached(fp);

    if (!m) {
        return;
    }

    if (typeof m === 'function') {
        // if the module provides a factory function
        // then invoke it to get a instance
        m = m(context);
    }

    return m;
}

function requireUncached(module) {
    delete require.cache[require.resolve(module)];
    return require(module);
}