import {createStore, applyMiddleware} from 'redux';
import EncryptedStorage from 'react-native-encrypted-storage';
import {persistStore, persistReducer} from 'redux-persist';
import thunk from 'redux-thunk';
import reducers from './reducers/index';

const persistConfig = {
  key: 'root',
  storage: EncryptedStorage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const Store = createStore(persistedReducer, applyMiddleware(thunk));
export const persistor = persistStore(Store);
