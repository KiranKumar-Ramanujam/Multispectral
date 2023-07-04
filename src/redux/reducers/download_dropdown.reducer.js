import {types} from '../../constants/reduxtypes.constant';

const initialState = {
  download_region: '',
  download_estate_group: '',
  download_estate: '',
  download_afdeling: '',
  download_block: '',
};

const download_dropdown_reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.DOWNLOADDROPDOWN_LABEL:
      return {
        download_region: action.download_region,
        download_estate_group: action.download_estate_group,
        download_estate: action.download_estate,
        download_afdeling: action.download_afdeling,
        download_block: action.download_block,
      };
    default:
      return state;
  }
};

export default download_dropdown_reducer;
