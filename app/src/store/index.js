import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import {authReducer} from './auth/authReducers'
import localStorageUtil from '../utils/storage';

const reducer = combineReducers({
    auth: authReducer
});

const user = localStorageUtil.get('user');
const token = localStorageUtil.getToken();

let initialState = {
    auth:{
        token:token,
        user:user?user.user:null,
        logged:token?true:false,
        error:null,
        loading:false
    }
}

const middlewares = [thunk];

const store = createStore(reducer, initialState, applyMiddleware(...middlewares));


export default store;