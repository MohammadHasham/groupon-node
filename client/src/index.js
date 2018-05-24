import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from "react-redux";
import {createStore,applyMiddleware} from "redux";
import reducers from './reducers';
import './index.css';
import Main from './components/Main';
import reduxThunk from "redux-thunk";
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';

const store = createStore(reducers,{},applyMiddleware(reduxThunk));
ReactDOM.render(<Provider store={store}><Main /></Provider>, document.getElementById('root'));
registerServiceWorker();
