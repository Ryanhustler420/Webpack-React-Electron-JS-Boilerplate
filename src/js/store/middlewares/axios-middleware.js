/**
 * NOTE: middleware gets called everytime you dispatch any action
 * NOTE: Do not mess with data which are going to receive by any reducer, BAD PRACTICE
 */

import axios from 'axios';
import _ from 'lodash';

/** (param) store:: get state of the application */
/** (param) next:: helps to proceed further in the funnel to next middleware when get call */
/** (param) action:: which we are dispatching  */
export default (store) => (next) => (action) => {

    axios.interceptors.response.use(function (response) {
        if (_.isUndefined(response)) return;
        const logMessage = `method=${response.config.method}mappedServiceUrl=${response.config.url}responseStatusCode=${response.status}`;
        // npm i logger
        // logger.info(logMessage)
        return response;
    }, function axiosRetryInterceptor(err) {
        if (err.response?.status == 401) {
            // TODO: logout user, clear session, redirect user to different screen
        } // else if ... more cases...
        return Promise.reject(err)
    });

    // when request goes from the application to server, it runs first always, so we are hooking header, cookies to the request
    // body
    axios.interceptors.request.use(async request => {
        if (!request.url.includes('/login') && !request.url.includes('users/create')) {
            const v = (await store.getState().session.infos).cookie.value;
            if (!_.isUndefined(v)) {
                request.withCredentials = true;
                request.headers[process.env.RaisehandCookieName] = (await store.getState().session.infos).cookie.value; // we need the on each req
                // request.timeoutErrorMessage = 'Connection timout has been trigger'
                // request.timeout = 60 * 5;
            }
        }
        // request.headers[process.env.RaisehandAccessPlatformName] = `[${Constants.PLATFORM_DESKTOP}, ${Constants.PLATFORM_WINDOWS}]`;
        // request.headers[process.env.RaisehandRouteCallerAppName] = Constants.APP_NAME;
        // request.headers[process.env.RaisehandAppVersion] = Constants.APP_RELEASE_VERSION;
        // request.headers[process.env.RaisehandServerVersion] = Constants.SERVER_VERSION_CODE;
        return request;
    }, error => {
        return Promise.reject(error);
    });

    next(action) // goes to next middleware, if has any!
}