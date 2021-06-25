import Storage from './../utils/storage';
import { TYPES } from '../actions/types';

import { combineReducers } from 'redux';
import { createReducer } from '@reduxjs/toolkit';

function createSettingsReducer() {

    // this is state
    const INITIAL_STATE = {
        showNotifications: true,
        playSound: true,
        saveable: true, // we can keep this to later decide if we want to clear settings reducer or not
    }

    const settings = createReducer(INITIAL_STATE, {
        // here state value will be {}
        [TYPES.SETTINGS_UPDATE]: (state, action) => {
            const { setting, value } = action;
            state[setting] = value;
        },
        [TYPES.SETTINGS_INITIAL_LOAD]: (state, action) => {
            const storedSettings = Storage.getItem('app-settings');
            state = storedSettings
        }
    })

    const others = createReducer({}, {
        'ACTION_TYPE': (state, action) => {
            state['id'] = action.id || '#12'
        }
    })

    return combineReducers({
        settings,
        others
    })
}

export default createSettingsReducer()