// In this file we stage data for main process to work with

class DATA_STAGE {

    static #ENVS = {}
    // static #OTHER_DATA = [];

    static setEnvs(data) {
        if (typeof data == 'object')
            this.#ENVS = data;
    }

    static getEnvs() {
        return this.#ENVS;
    }

}

module.exports = DATA_STAGE;