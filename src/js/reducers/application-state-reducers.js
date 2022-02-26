import { TYPES } from "../actions/types";
import { combineReducers } from "redux"
import { createReducer } from '@reduxjs/toolkit';

function createApplicationStateReducer() {

    const INITIAL_STATE = {
        isPermissionRequiredPanel: false,
        isLoadingSpinner: false,
        isNetworkIssue: false,
        isLoadingPanel: false,
        isLoadingBar: false,
    }

    const bucket = createReducer(INITIAL_STATE, {
        [TYPES.HIDE_PERMISSION_REQUIRED_PANEL]: (state, action) => { state['isPermissionRequiredPanel'] = false; },
        [TYPES.SHOW_PERMISSION_REQUIRED_PANEL]: (state, action) => { state['isPermissionRequiredPanel'] = true; },
        [TYPES.HIDE_NETWORK_ISSUE_PANEL]: (state, action) => { state['isNetworkIssue'] = false; },
        [TYPES.SHOW_NETWORK_ISSUE_PANEL]: (state, action) => { state['isNetworkIssue'] = true; },
        [TYPES.HIDE_LOADING_SPINNER]: (state, action) => { state['isLoadingSpinner'] = false; },
        [TYPES.SHOW_LOADING_SPINNER]: (state, action) => { state['isLoadingSpinner'] = true; },
        [TYPES.HIDE_LOADING_PANEL]: (state, action) => { state['isLoadingPanel'] = false; },
        [TYPES.SHOW_LOADING_PANEL]: (state, action) => { state['isLoadingPanel'] = true; },
        [TYPES.HIDE_LOADING_BAR]: (state, action) => { state['isLoadingBar'] = false; },
        [TYPES.SHOW_LOADING_BAR]: (state, action) => { state['isLoadingBar'] = true; },
    });

    // state example { from: '/login', to: '/', consume: false, goBack: false, afterRedirectCanGoBack: false }
    const redirection = createReducer({}, {
        [TYPES.CREATE_NEW_REDIRECT_REQUEST]: (state, action) => {
            const { initialize: { from, to, consume } } = action;
            state[from] = { to, consume }
        },
        [TYPES.CONSUME_REDIRECT_REQUEST_SUCCESSFULLY]: (state, action) => {
            const { update: { from, consume } } = action;
            state[from] = { ...state[from], consume }
        },
    })

    const SIDE_NAV_OPTIONS_INITAIL_STATE = {
        dashboardPermission: true,
        myProductsPermssion: true,
        profilePermssion: false,
        statusPermssion: false,

        newProductCreationPermission: true,
        settingsPermission: true,
        logoutPermission: true,
    }

    const sideNavOptions = createReducer(SIDE_NAV_OPTIONS_INITAIL_STATE, {
        [TYPES.REMOVE_NEW_PRODUCT_CREATION_PERMISSION]: (state, action) => {
            state['newProductCreationPermission'] = false;
        },
        [TYPES.GIVE_NEW_PRODUCT_CREATION_PERMISSION]: (state, action) => {
            state['newProductCreationPermission'] = true;
        },
        [TYPES.REMOVE_SETTINGS_PERMISSION]: (state, action) => {
            state['settingsPermission'] = false;
        },
        [TYPES.GIVE_SETTINGS_PERMISSION]: (state, action) => {
            state['settingsPermission'] = true;
        },
        [TYPES.REMOVE_DASHBOARD_PERMISSION]: (state, action) => {
            state['dashboardPermission'] = false;
        },
        [TYPES.GIVE_DASHBOARD_PERMISSION]: (state, action) => {
            state['dashboardPermission'] = true;
        },
        [TYPES.REMOVE_MY_PRODUCTS_PERMISSION]: (state, action) => {
            state['myProductsPermssion'] = false;
        },
        [TYPES.GIVE_MY_PRODUCTS_PERMISSION]: (state, action) => {
            state['myProductsPermssion'] = true;
        },
        [TYPES.REMOVE_PROFILE_PERMISSION]: (state, action) => {
            state['profilePermssion'] = false;
        },
        [TYPES.GIVE_PROFILE_PERMISSION]: (state, action) => {
            state['profilePermssion'] = true;
        },
        [TYPES.REMOVE_STATUS_PERMISSION]: (state, action) => {
            state['statusPermssion'] = false;
        },
        [TYPES.GIVE_STATUS_PERMISSION]: (state, action) => {
            state['statusPermssion'] = true;
        },
        [TYPES.REMOVE_LOGOUT_PERMISSION]: (state, action) => {
            state['logoutPermission'] = false;
        },
        [TYPES.GIVE_LOGOUT_PERMISSION]: (state, action) => {
            state['logoutPermission'] = true;
        },
        [TYPES.RESET_OPTION_PERMISSIONS_TO_DEFAULT]: (state, action) => {
            state['newProductCreationPermission'] = true;
            state['dashboardPermission'] = true;
            state['myProductsPermssion'] = true;
            state['settingsPermission'] = true;
            state['profilePermssion'] = false;
            state['statusPermssion'] = false;
            state['logoutPermission'] = true;
        },
    });

    const HEADER_OPTIONS_INITAIL_STATE = {
        searchProductRepositoriesPermission: true,
        searchRepoProductsPermission: true,
    }

    const headerOptions = createReducer(HEADER_OPTIONS_INITAIL_STATE, {
        [TYPES.REMOVE_SEARCH_PRODUCT_REPOSITORIES_PERMISSION]: (state, action) => {
            state['searchProductRepositoriesPermission'] = false;
        },
        [TYPES.GIVE_SEARCH_PRODUCT_REPOSITORIES_PERMISSION]: (state, action) => {
            state['searchProductRepositoriesPermission'] = true;
        },
        [TYPES.REMOVE_SEARCH_REPO_PRODUCTS_PERMISSION]: (state, action) => {
            state['searchRepoProductsPermission'] = false;
        },
        [TYPES.GIVE_SEARCH_REPO_PRODUCTS_PERMISSION]: (state, action) => {
            state['searchRepoProductsPermission'] = true;
        },
    });

    return combineReducers({ bucket, redirection, sideNavOptions, headerOptions });

}

export default createApplicationStateReducer()