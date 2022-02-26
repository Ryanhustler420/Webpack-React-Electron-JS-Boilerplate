import React from 'react';
import { withBaseLayout } from '../hocs/BaseLayout';

function Temp() {
    return (
        <>
            <h1>Hi, There!</h1>
        </>
    );
}

export default withBaseLayout(Temp, { canGoBack: true });