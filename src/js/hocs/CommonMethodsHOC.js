import React, { Component, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { hideLoadingBar, hideLoadingSpinner, redirectConsume } from './../actions/application-state-actions';

// This HOC contains all the methods/hooks which are common between pages
function HOC({ WrappedComponent, ...rest }) {

    // Hooks
    const location = useLocation();
    const dispatch = useDispatch();
    const history = useHistory();

    // Redux State
    const redirection = useSelector(({ applicationState }) => applicationState.redirection);
    const session = useSelector(({ session }) => session.infos) // everytime session changes it will run again

    //************************************************* */
    //************************************************* */
    const PAGES_NOT_ALLOWED_TO_VISIT_ONCED_LOGGED_IN = ['/login', '/register']
    const notAllowToVisit = PAGES_NOT_ALLOWED_TO_VISIT_ONCED_LOGGED_IN.includes(location.pathname);
    useEffect(() => {
        // if session present it will redirect use to dashboard
        if (session.cookie && notAllowToVisit) { history.push('/'); }
    }, [session])
    //************************************************* */
    //************************************************* */
    useEffect(() => {
        if (redirection[location.pathname] && redirection[location.pathname]?.consume == false) {
            dispatch(redirectConsume(location.pathname));
            history.replace(redirection[location.pathname].to);
        }
    }, [redirection]);
    //************************************************* */
    //************************************************* */
    // Getting called on every page leave
    useEffect(() => {
        return () => {
            dispatch(hideLoadingBar());
            dispatch(hideLoadingSpinner());
        }
    }, []);
    //************************************************* */
    //************************************************* */

    // Simply return the component
    return (<WrappedComponent {...rest} />);
}

const CommonMethodsHOC = (WrappedComponent) => {
    return class CommonMethods extends Component {
        render() {
            return (<HOC WrappedComponent={WrappedComponent} props={this.props} />)
        }
    }
}

export default CommonMethodsHOC;