import React from 'react';
import ReactDOM from 'react-dom';
import { compose, createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import App from './App';
import './normalize.css';
import './style.css';
import { rootReducer } from './redux/rootReducer.js';

const isProd = process.env.NODE_ENV === 'production';
const composeEnhancers = isProd ? compose : window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
