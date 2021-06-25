/**
 * NOTE: middleware gets called everytime you dispatch any action
 * NOTE: Do not mess with data which are going to receive by any reducer, BAD PRACTICE
 */

import { TYPES } from '../../actions/types'
import Storage from '../../utils/storage';

/** (param) store:: get state of the application */
/** (param) next:: helps to proceed further in the funnel to next middleware when get call */
/** (param) action:: which we are dispatching  */
export default (store) => (next) => (action) => {

    const DataBucket = store.getState();

    switch (action.type) {
        case TYPES.SETTINGS_UPDATE: {
            const { setting, value } = action;
            const currentSettings = Storage.getItem('app-settings');
            const settings = { ...currentSettings, [setting]: value }
            Storage.setItem('app-settings', settings)
        }
    }
    next(action) // goes to next middleware, if has any!
}