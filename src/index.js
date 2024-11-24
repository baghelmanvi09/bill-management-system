// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';  // Your main App component
import { Provider } from 'react-redux';  // Import the Provider component from react-redux
import store from './Store';  // Import the store created in store.js

ReactDOM.render(
  <Provider store={store}>  {/* Wrap your app with the Provider */}
    <App />
  </Provider>,
  document.getElementById('root')  // Attach the app to the root element
);
