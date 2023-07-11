import {types} from '../../constants/reduxtypes.constant';
import DeviceInfo from 'react-native-device-info';

export const openDatabaseAction = () => {
  return async dispatch => {
    try {
      const deviceId = await DeviceInfo.getUniqueId();
      await dispatch({type: types.DATABASE_OPENED, payload: deviceId});
    } catch (error) {
      dispatch({type: types.DATABASE_ERROR, payload: error});
    }
  };
};
