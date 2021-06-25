import React from 'react';
import configureStore from './index';
import { Provider } from 'react-redux';

const store = configureStore();
export default function StoreProvider({ children }) {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}