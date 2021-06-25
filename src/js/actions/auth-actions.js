import * as API from '../apis/users-apis';
import { TYPES } from './types';

export const getLoggedInUser = () => dispatch => {
    dispatch({ type: TYPES.CURRENT_USER_FETCHING_INIT })
    return API.getCurrentUser().then(user => {
        dispatch({ type: TYPES.CURRENT_USER_FETCHED_SUCCESS, user })
    }).catch(reason => dispatch({ type: TYPES.CURRENT_USER_FETCHED_FAILD, error: reason }))
}

export const getCurrentLoggedInUser = uid => dispatch => {
    dispatch({ type: TYPES.USER_FETCHING_BY_ID_INIT })
    return API.getUserWithId(uid).then(user => {
        dispatch({ type: TYPES.USER_FETCHED_BY_ID_SUCCESS, user })
    }).catch(reason => dispatch({ type: TYPES.USER_FETCHED_BY_ID_FAILD, error: reason }))
}

// more actions goes here...