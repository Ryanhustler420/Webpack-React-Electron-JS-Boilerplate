// Used to store light weight data on browser side so that use can decide what to do in some situation, like retrieve from cache or from server
// this class has a job to R/W from browser storage, but also has some helper util methods to quick to query

const Constants = require('../../Constants');

class BROWSER_STORAGE {

    static #SecretKeys = {
        SHOW_RUNNING_ENV: `appname_show_running_env`,
        SHOW_CWD_FILES: `appname_show_cwd`,
    }

    static #KEYS = {
        LOGGED_IN_USER: `${Constants.rootNode}_appname_is_user_logged_in`,

        // Settings variables
        IMAGE_CONTAINER_STATUS: `${Constants.rootNode}_appname_image_container_status`,
        SHOW_NOTIFICATIONS: `${Constants.rootNode}_appname_show_notifications`,
        IMAGE_PADDING_SET: `${Constants.rootNode}_appname_image_padding_set`,
        IMAGE_CONTAINER: `${Constants.rootNode}_appname_image_container`,
        DARK_THEME: `${Constants.rootNode}_appname_dark_theme`,
        SOUND_ON: `${Constants.rootNode}_appname_sound_on`,

        IMAGE_IDK_DETAILS: `${Constants.rootNode}_appname_image_idk_details`,
    }

    // Methods (Helper)
    static showRunningEnvValue() { return this._get(this.#SecretKeys.SHOW_RUNNING_ENV); }
    static showCwdFilesValue() { return this._get(this.#SecretKeys.SHOW_CWD_FILES); }

    static saveImageIdkDetails(details = {}) { return this._save(this.#KEYS.IMAGE_IDK_DETAILS, JSON.stringify(details)); }
    static getImageIdkDetails() { return this._get(this.#KEYS.IMAGE_IDK_DETAILS); }
    static resetImageIdkDetails() { return this._save(this.#KEYS.IMAGE_IDK_DETAILS, JSON.stringify({})); }

    static saveImageContainer(ic = image_containers.image_container_raisehand) { return this._save(this.#KEYS.IMAGE_CONTAINER, JSON.stringify(ic)); }
    static resetImageContainer() { return this._save(this.#KEYS.IMAGE_CONTAINER, JSON.stringify({ default_ic: image_containers.image_container_raisehand })); }
    static getImageContainer() { return JSON.parse(this._get(this.#KEYS.IMAGE_CONTAINER)); }

    static saveImageContainerStatus(ic_status = {}) { return this._save(this.#KEYS.IMAGE_CONTAINER_STATUS, JSON.stringify(ic_status)); }
    static resetImageContainerStatus() { return this._save(this.#KEYS.IMAGE_CONTAINER_STATUS, JSON.stringify({})); }
    static getImageContainerStatus() { return JSON.parse(this._get(this.#KEYS.IMAGE_CONTAINER_STATUS)); }

    static savePaddingSet(padLeft = 50, padTop = 50, padRight = 50, padBottom = 50) { return this._save(this.#KEYS.IMAGE_PADDING_SET, JSON.stringify({ padLeft, padTop, padRight, padBottom })); }
    static resetPaddingSet() { return this._save(this.#KEYS.IMAGE_PADDING_SET, JSON.stringify({ padLeft: 50, padTop: 50, padRight: 50, padBottom: 50 })); }
    static getPaddingSet() { return JSON.parse(this._get(this.#KEYS.IMAGE_PADDING_SET)); }

    static showNotifications() { return this._save(this.#KEYS.SHOW_NOTIFICATIONS, true); }
    static stopNotifications() { return this._save(this.#KEYS.SHOW_NOTIFICATIONS, false); }
    static getNotifiationStatus() { return this._get(this.#KEYS.SHOW_NOTIFICATIONS); }

    static turnOnDarkTheme() { return this._save(this.#KEYS.DARK_THEME, true); }
    static turnOfDarkTheme() { return this._save(this.#KEYS.DARK_THEME, false); }
    static getDarkThemeStatus() { return this._get(this.#KEYS.DARK_THEME); }

    static turnOnSound() { return this._save(this.#KEYS.SOUND_ON, true); }
    static turnOffSound() { return this._save(this.#KEYS.SOUND_ON, false); }
    static getSoundStatus() { return this._get(this.#KEYS.SOUND_ON); }

    static userIsNowLoggedIn() { return this._save(this.#KEYS.LOGGED_IN_USER, true); }
    static userIsNowLoggedOut() { return this._save(this.#KEYS.LOGGED_IN_USER, false); }
    static isUserLoggedIn() { return this._get(this.#KEYS.LOGGED_IN_USER) == 'true' ? true : false; }

    static saveCurrentTimestampForLastFetch_MyNotification() { return this._saveLastFetchedAt(this.#KEYS.MY_NOTIFICATION_LAST_FETCHED_TIMESTAMP); }
    static getTimestampForLastFetch_MyNotification() { return this._getLastFetchedAt(this.#KEYS.MY_NOTIFICATION_LAST_FETCHED_TIMESTAMP); }
    static resetTimestampForLastFetch_MyNotification() { return this._save(this.#KEYS.MY_NOTIFICATION_LAST_FETCHED_TIMESTAMP, Constants.NULL); }

    // Call it once and all the data will be set to old state
    static resetAll(user) {
        this.userIsNowLoggedOut();
        this.resetTimestampForLastFetch_MyNotification();
    }

    static _saveLastFetchedAt(key) { return this._save(key, Date.now()); }
    static _getLastFetchedAt(key) { return this._get(key); }

    // Generic method
    static _save(key, value) { return localStorage.setItem(key, value); }
    static _get(key) { return localStorage.getItem(key); }
}

module.exports = BROWSER_STORAGE;