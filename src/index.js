import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { store } from "./store";
import "./i18n"

ReactDOM.render(
    <React.StrictMode>
        <Suspense fallback={(<div>Loading...</div>)}>
            <Provider store={store}>
                <App />
            </Provider>
        </Suspense>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
