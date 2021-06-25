import { createStore, applyMiddleware, combineReducers } from 'redux'
import { TYPES } from '../actions/types';
import thunkMiddleware from 'redux-thunk'
import _ from 'lodash';

// Reducers
import authReducer from '../reducers/auth-reducers'
import settingReducer from '../reducers/settings-reducers';
import connectionReducer from '../reducers/connection-reducers'

// Middlewares
import connectionMiddleware from './middlewares/connection-middleware'
import settingMiddleware from './middlewares/setting-middleware'
import authMiddleware from './middlewares/auth-middleware'

// We store all the data to this store,
// All the reducer, actions, component, api
// Every cornor of this application will take advantage
// Of this store, this is a central place for data parking
export default function configureStore() {

    const middlewares = [
        thunkMiddleware,

        authMiddleware,
        settingMiddleware,
        connectionMiddleware,
    ]

    const mainReducer = combineReducers({
        auth: authReducer,
        settings: settingReducer,
        connection: connectionReducer,
    });

    const filteredReducer = (state, action) => {
        if (action.type === TYPES.AUTH_LOGOUT_SUCCESS) {
            _.keys(state).forEach(saveableKey => {
                if (state[saveableKey]) {
                    return; // do nothing
                }
                state[saveableKey] = undefined;
            })
        }
        return mainReducer(state, action)
    }

    const store = createStore(filteredReducer, applyMiddleware(...middlewares))
    return store;
}