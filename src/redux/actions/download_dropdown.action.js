import {types} from '../../constants/reduxtypes.constant';

export const DownloadDropdownLabelAction =
  (
    download_region,
    download_estate_group,
    download_estate,
    download_afdeling,
    download_block,
  ) =>
  (dispatch, getState) => {
    dispatch(
      DownloadDropdownLabelActive(
        download_region,
        download_estate_group,
        download_estate,
        download_afdeling,
        download_block,
      ),
    );
  };
const DownloadDropdownLabelActive =
  (
    download_region,
    download_estate_group,
    download_estate,
    download_afdeling,
    download_block,
  ) =>
  dispatch => {
    dispatch({
      type: types.DOWNLOADDROPDOWN_LABEL,
      download_region: download_region,
      download_estate_group: download_estate_group,
      download_estate: download_estate,
      download_afdeling: download_afdeling,
      download_block: download_block,
    });
  };
