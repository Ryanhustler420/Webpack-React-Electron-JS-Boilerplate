
import { TYPES } from './types'

const onStateChange = dispatch => () => {
    const isOnline = navigator.onLine;
    const action = isOnline ?
        { type: TYPES.APP_IS_ONLINE, isOnline } :
        { type: TYPES.APP_IS_OFFLINE, isOnline }
    dispatch(action)
}

export const listenToConnectionChanges = () => dispatch => {

    const connectionHandler = onStateChange(dispatch);

    window.addEventListener('online', connectionHandler)
    window.addEventListener('offline', connectionHandler)

    // will be called when this componet gets destroyed
    return () => {
        window.removeEventListener('online', connectionHandler)
        window.removeEventListener('offline', connectionHandler)
    }

}