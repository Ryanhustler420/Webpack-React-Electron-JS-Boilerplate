// this component will give you an idea about how you should wrap the code
// EXAMPLE: export default withBaseLayout(YourComponent, { canGoBack: true, users: users || [] })

import React from 'react';
// import Navbar from '../components/Navbar';

const getDisplayName = Component => (Component.displayName || Component.name || 'Component');

// Creating HOC
export const withBaseLayout = (Component, config) => (props) => {

    // we can get the name of the component inside HOC wrapper
    const componentName = getDisplayName(Component)

    return (
        <>
            {/* <Navbar {...config} componentName={componentName} /> */}
            <Component {...props} componentName={componentName} />
        </>
    )
}