// const DATA_STAGE = require('./DataStage'); // we can use this to access the data send from renderer to main process via a static class
const Base64 = require('js-base64');
const _ = require('lodash');

class DataEncryption {

    async encode(data, subject) {
        if (_.isUndefined(data) || _.isUndefined(subject) || _.isEmpty(data)) return '';
        return await new Promise((resolve, reject) => {
            const encoded = Base64.encode(JSON.stringify({ data }));
            resolve(encoded);
        }).catch(err => err);
    }

    async decode(token) {
        if (_.isUndefined(token)) return null;
        return await new Promise((resolve, reject) => {
            const decoded = Base64.decode(token);
            if (typeof decoded == 'string') resolve(JSON.parse(decoded).data);
            resolve(decoded.data);
        }).catch(err => err);
    }

}

module.exports = DataEncryption;