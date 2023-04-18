import {actionTypes} from '../../constants/reduxtypes.constant';

const loginDataType = actionTypes('GET_LOGIN_USER');

export const getLoginData = (username, password) => {
  return dispatch => {
    dispatch({
      type: loginDataType.REQUEST,
    });
    try {
      dispatch({
        type: loginDataType.SUCCESS,
        payload: true,
      });
    } catch (error) {
      dispatch({
        type: loginDataType.FAILURE,
      });
    }
  };
};

export const getLogoutData = (username, password) => {
  return dispatch => {
    dispatch({
      type: loginDataType.REQUEST,
    });
    try {
      dispatch({
        type: loginDataType.SUCCESS,
        payload: false,
      });
    } catch (error) {
      dispatch({
        type: loginDataType.FAILURE,
      });
    }
  };
};
