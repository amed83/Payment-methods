import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Router,Route, browserHistory, IndexRoute } from 'react-router-3';

import Dashboard from './components/Dashboard/Dashboard';

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <Route path ="/page/:number" component ={App}/>
            <IndexRoute component = {Dashboard} />

        </Route>
    </Router>
    , document.getElementById('root'));
registerServiceWorker();
