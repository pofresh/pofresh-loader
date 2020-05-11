/**
 * Mock remote service
 */
module.exports = function (app) {
    return {
        doService(value, cb) {
            cb(null, value + 1);
        },

        doAddTwo(value, cb) {
            cb(null, value + 2);
        }
    };
};