import {createStore, combineReducers, applyMiddleware} from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistStore, persistReducer} from 'redux-persist';

import thunk from 'redux-thunk';

import reducers from './reducers/index';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const Store = createStore(persistedReducer, applyMiddleware(thunk));
export const persistor = persistStore(Store);
