import {types} from '../../constants/reduxtypes.constant';

const initialState = {
  green_isActive: false,
  red_isActive: false,
  blue_isActive: false,
};

const switchtoggle_reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.TOGGLE_SWITCH_ACTIVE:
      return {
        green_isActive: action.green_isActive,
        red_isActive: action.red_isActive,
        blue_isActive: action.blue_isActive,
      };

    default:
      return state;
  }
};
export default switchtoggle_reducer;
