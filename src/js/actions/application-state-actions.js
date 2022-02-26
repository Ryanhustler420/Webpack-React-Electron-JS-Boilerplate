import { TYPES } from './types';

export const showPermissionPanel = () => dispatch => dispatch({ type: TYPES.SHOW_PERMISSION_REQUIRED_PANEL })
export const hidePermissionPanel = () => dispatch => dispatch({ type: TYPES.HIDE_PERMISSION_REQUIRED_PANEL })

export const showLoadingSpinner = () => dispatch => dispatch({ type: TYPES.SHOW_LOADING_SPINNER })
export const hideLoadingSpinner = () => dispatch => dispatch({ type: TYPES.HIDE_LOADING_SPINNER })

export const showLoadingPanel = () => dispatch => dispatch({ type: TYPES.SHOW_LOADING_PANEL })
export const hideLoadingPanel = () => dispatch => dispatch({ type: TYPES.HIDE_LOADING_PANEL })

export const showNetworkIssuePanel = () => dispatch => dispatch({ type: TYPES.SHOW_NETWORK_ISSUE_PANEL })
export const hideNetworkIssuePanel = () => dispatch => dispatch({ type: TYPES.HIDE_NETWORK_ISSUE_PANEL })

export const showLoadingBar = () => dispatch => dispatch({ type: TYPES.SHOW_LOADING_BAR })
export const hideLoadingBar = () => dispatch => dispatch({ type: TYPES.HIDE_LOADING_BAR })

export const enableCreateNewProductOption = () => dispatch => dispatch({ type: TYPES.GIVE_NEW_PRODUCT_CREATION_PERMISSION });
export const diableCreateNewProductOption = () => dispatch => dispatch({ type: TYPES.REMOVE_NEW_PRODUCT_CREATION_PERMISSION });

export const enableSearchProductRepositoriesOption = () => dispatch => dispatch({ type: TYPES.GIVE_SEARCH_PRODUCT_REPOSITORIES_PERMISSION });
export const diableSearchProductRepositoriesOption = () => dispatch => dispatch({ type: TYPES.REMOVE_SEARCH_PRODUCT_REPOSITORIES_PERMISSION });

export const enableSearchRepoProductsOption = () => dispatch => dispatch({ type: TYPES.GIVE_SEARCH_REPO_PRODUCTS_PERMISSION });
export const diableSearchRepoProductsOption = () => dispatch => dispatch({ type: TYPES.REMOVE_SEARCH_REPO_PRODUCTS_PERMISSION });

export const enableSettingsOption = () => dispatch => dispatch({ type: TYPES.GIVE_SETTINGS_PERMISSION });
export const diableSettingsOption = () => dispatch => dispatch({ type: TYPES.REMOVE_SETTINGS_PERMISSION });

export const enableDashboardOption = () => dispatch => dispatch({ type: TYPES.GIVE_DASHBOARD_PERMISSION });
export const diableDashboardOption = () => dispatch => dispatch({ type: TYPES.REMOVE_DASHBOARD_PERMISSION });

export const enableMyProductsOption = () => dispatch => dispatch({ type: TYPES.GIVE_MY_PRODUCTS_PERMISSION });
export const diableMyProductsOption = () => dispatch => dispatch({ type: TYPES.REMOVE_MY_PRODUCTS_PERMISSION });

export const enableProfileOption = () => dispatch => dispatch({ type: TYPES.GIVE_PROFILE_PERMISSION });
export const diableProfileOption = () => dispatch => dispatch({ type: TYPES.REMOVE_PROFILE_PERMISSION });

export const enableStatusOption = () => dispatch => dispatch({ type: TYPES.GIVE_STATUS_PERMISSION });
export const diableStatusOption = () => dispatch => dispatch({ type: TYPES.REMOVE_STATUS_PERMISSION });

export const enableLogoutOption = () => dispatch => dispatch({ type: TYPES.GIVE_LOGOUT_PERMISSION });
export const diableLogoutOption = () => dispatch => dispatch({ type: TYPES.REMOVE_LOGOUT_PERMISSION });

export const resetOptionPermissionsToDefault = () => dispatch => dispatch({ type: TYPES.RESET_OPTION_PERMISSIONS_TO_DEFAULT });

export const redirectTo = (from = '/login', to = '/') => dispatch => dispatch({ type: TYPES.CREATE_NEW_REDIRECT_REQUEST, initialize: { from, to, consume: false } });
export const redirectConsume = (from = '/login', consume = true) => dispatch => dispatch({ type: TYPES.CONSUME_REDIRECT_REQUEST_SUCCESSFULLY, update: { from, consume } });