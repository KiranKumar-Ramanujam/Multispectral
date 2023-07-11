import {combineReducers} from 'redux';
import download_dropdown_reducer from './download_dropdown.reducer';
import switchtoggle_reducer from './switch.reducer';
import dropdownset_reducer from './dropdown.reducer';
import tree_reducer from './trees.reducer';
import getLoginDataReducer from './logindetail.reducer';
import databaseReducer from './database.reducer';

const reducers = combineReducers({
  download_dropdown_reducer,
  switchtoggle_reducer,
  dropdownset_reducer,
  tree_reducer,
  getLoginDataReducer,
  databaseReducer,
});

export default reducers;
