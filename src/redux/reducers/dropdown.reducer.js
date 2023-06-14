import {types} from '../../constants/reduxtypes.constant';

const initialState = {
  region_label: '',
  estate_group_label: '',
  estate_label: '',
  afdeling_label: '',
  block_label: '',
  reason_status_label: '',
};

const dropdownset_reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FILTERDROPDOWN_LABEL:
      return {
        region_label: action.region_label,
        estate_group_label: action.estate_group_label,
        estate_label: action.estate_label,
        afdeling_label: action.afdeling_label,
        block_label: action.block_label,
      };

    default:
      return state;
  }
};

export default dropdownset_reducer;
