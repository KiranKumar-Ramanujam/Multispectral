import {types} from '../../constants/reduxtypes.constant';

const initialState = {
  pass: null,
  error: null,
};

const databaseReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.DATABASE_OPENED:
      return {
        ...state,
        pass: action.payload,
        error: null,
      };
    case types.DATABASE_ERROR:
      return {
        ...state,
        pass: null,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default databaseReducer;
