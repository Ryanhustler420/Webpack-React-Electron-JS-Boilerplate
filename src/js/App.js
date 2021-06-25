import React, { useEffect } from 'react';

import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';

import StoreProvider from './store/StoreProvider';

// Components
import Temp from './components/Temp';

// Actions
import { getLoggedInUser } from './actions/auth-actions';

function Application() {

    const dispatch = useDispatch(getLoggedInUser());
    const isChecking = useSelector(({ auth }) => auth.isChecking);

    // life cycle like method, stop using componentDidMount() or other
    useEffect(() => { console.log(isChecking); }, [dispatch])
    useEffect(() => { console.log(isChecking); }, [])

    return (
        <Router>
            <Switch>
                <Route path="/" exact>
                    <Temp />
                </Route>
                <AuthRoute path="/route1">
                    <Temp />
                </AuthRoute>
                <AuthRoute path="/route2">
                    <Temp />
                </AuthRoute>
                <AuthRoute path="/route3/:id">
                    <Temp />
                </AuthRoute>
                <AuthRoute path="/route4">
                    <Temp />
                </AuthRoute>
            </Switch>
        </Router>
    )
}

// This HOC is responsible for checking the user auth state
// So the they can access the auth specific routes, like /home or /route/:id
function AuthRoute({ children, ...rest }) {
    const user = useSelector(({ auth }) => auth.user)
    const onlyChild = React.Children.only(children)

    return (<Route
        {...rest} // Providing the props as it is to children
        render={props =>
            user ? React.cloneElement(onlyChild, { ...rest, ...props }) :
                <Redirect to="/" />} />
    )
}

export default function App() {
    return (
        <StoreProvider>
            <Application />
        </StoreProvider>
    )
}