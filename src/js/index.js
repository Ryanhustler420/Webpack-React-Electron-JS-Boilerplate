import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css'
import './index.scss'

ReactDOM.render(<App />, document.getElementById('Root'))

// Target container is not a DOM element. if 'document.getElementById()' has wrong id from html