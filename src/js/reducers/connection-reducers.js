import { combineReducers } from 'redux';
import { TYPES } from './../actions/types';

function createRootReducer() {
    const { onLine } = navigator; // returns boolean value
    const isOnline = (state = onLine, action) => {
        switch (action.type) {
            case TYPES.APP_IS_ONLINE:
            case TYPES.APP_IS_OFFLINE:
                return action.isOnline;
            default:
                return state;
        }
    }

    // isOnline: false, true
    return combineReducers({
        isOnline
    })
}

export default createRootReducer()