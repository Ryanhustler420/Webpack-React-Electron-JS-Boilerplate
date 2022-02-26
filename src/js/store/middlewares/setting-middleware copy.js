/**
 * NOTE: middleware gets called everytime you dispatch any action
 * NOTE: Do not mess with data which are going to receive by any reducer, BAD PRACTICE
 */

import { TYPES } from '../../actions/types'
import BROWSER_STORAGE from '../../utils/BrowserStorage';

/** (param) store:: get state of the application */
/** (param) next:: helps to proceed further in the funnel to next middleware when get call */
/** (param) action:: which we are dispatching  */
export default (store) => (next) => (action) => {

    const state = store.getState();
    const dispatch = store.dispatch;
    const { value } = action;

    switch (action?.type) {
        case TYPES.UPDATE_SETTINGS_IMAGE_PADDING:
            BROWSER_STORAGE.savePaddingSet(value.padLeft, value.padTop, value.padRight, value.padBottom);
            break;
        case TYPES.UPDATE_SETTINGS_IMAGE_CONTAINER:
            BROWSER_STORAGE.saveImageContainer(value);
            break;
        case TYPES.UPDATE_SETTINGS_DARK_THEME:
            value ? BROWSER_STORAGE.turnOnDarkTheme() : BROWSER_STORAGE.turnOfDarkTheme();
            break;
        case TYPES.UPDATE_SETTINGS_PLAY_SOUND:
            value ? BROWSER_STORAGE.turnOnSound() : BROWSER_STORAGE.turnOffSound();
            break;

        // NOTIFICATIONS
        case TYPES.UPDATE_SETTINGS_SHOW_NOTIFICATIONS:
            value ? BROWSER_STORAGE.showNotifications() : BROWSER_STORAGE.stopNotifications();
            break;
        case TYPES.UPDATE_SETTINGS_TOGGLE_SHOW_NOTIFICATIONS:
            dispatch({ type: TYPES.UPDATE_SETTINGS_SHOW_NOTIFICATIONS, value: !state.settings.bucket.showNotifications })
            break;

        // ALL_IN_ONE
        case TYPES.UPDATE_SETTINGS:
            // const currentSettings = Storage.getItem('app-settings');
            // const settings = { ...currentSettings, [setting]: value }
            // Storage.setItem('app-settings', settings)
            break;
    }
    next(action) // goes to next middleware, if has any!
}