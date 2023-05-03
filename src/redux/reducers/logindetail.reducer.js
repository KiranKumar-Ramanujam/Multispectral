import {actionTypes} from '../../constants/reduxtypes.constant';

const initialState = {
  isLoading: false,
  login: false,
};
const loginDataType = actionTypes('GET_LOGIN_USER');

const getLoginDataReducer = (state = initialState, action) => {
  const {type, payload} = action;
  switch (type) {
    case loginDataType.REQUEST:
      return {...state, isLoading: true};

    case loginDataType.SUCCESS:
      return {...state, login: payload, isloading: false};

    case loginDataType.FAILURE:
      return {...state, isLoading: false};
    default:
      return state;
  }
};
export default getLoginDataReducer;
