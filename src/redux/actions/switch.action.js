import {types} from '../../constants/reduxtypes.constant';

export const SwitchToggleAction =
  (green_isActive, red_isActive, blue_isActive) => (dispatch, getState) => {
    dispatch(switchToggleActive(green_isActive, red_isActive, blue_isActive));
  };
const switchToggleActive =
  (green_isActive, red_isActive, blue_isActive) => dispatch => {
    dispatch({
      type: types.TOGGLE_SWITCH_ACTIVE,
      green_isActive: green_isActive,
      red_isActive: red_isActive,
      blue_isActive: blue_isActive,
    });
  };
