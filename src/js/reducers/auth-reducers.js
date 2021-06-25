import { TYPES } from "../actions/types";
import { combineReducers } from "redux"
import { createErrorReducer, createIsFetchingReducer } from './common-reducers';

// Just a way for creating reducers
const createLoginReducer = () => combineReducers({
    isChecking: createIsFetchingReducer('AUTH_LOGIN'),
    error: createErrorReducer('AUTH_LOGIN')
})

const createRegisterReducer = () => combineReducers({
    isChecking: createIsFetchingReducer('AUTH_REGISTER'),
    error: createErrorReducer('AUTH_REGISTER')
})

// Just a way for creating reducers
function authReducer() {
    const user = (state = null, action) => {
        switch (action.type) {
            case TYPES.AUTH_ON_ERROR:
            case TYPES.AUTH_ON_INIT:
                return null
            case TYPES.AUTH_REGISTER_SUCCESS:
            case TYPES.AUTH_LOGIN_SUCCESS:
            case TYPES.AUTH_ON_SUCCESS:
                return action.user
            default:
                return state
        }
    }

    // Look like these
    // user: {}
    // isChecking: false || true
    // login: { isChecking: false || true, error: null || {} }
    // register: { isChecking: false || true, error: null || {} }

    return combineReducers({
        user,
        isChecking: createIsFetchingReducer('AUTH_ON'),
        login: createLoginReducer(),
        register: createRegisterReducer(),
    })

}

export default authReducer()