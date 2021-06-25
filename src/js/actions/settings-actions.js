// simple dispatch, since this method i.e action will be called by dispatch, it will work just fine

import { TYPES } from "./types"

export const updateSettings = (setting, value) => {
    return {
        type: TYPES.SETTINGS_UPDATE,
        setting,
        value
    }
}

export const loadInitialSettings = (setting, value) => {
    return { type: TYPES.SETTINGS_INITIAL_LOAD }
}