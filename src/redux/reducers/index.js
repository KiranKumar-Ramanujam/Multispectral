import {combineReducers} from 'redux';
import switchtoggle_reducer from './switch.reducer';
import dropdownset_reducer from './dropdown.reducer';
import tree_reducer from './trees.reducer';
import getLoginDataReducer from './logindetail.reducer';

const reducers = combineReducers({
  switchtoggle_reducer,
  dropdownset_reducer,
  tree_reducer,
  getLoginDataReducer,
});

export default reducers;
