import {types} from '../../constants/reduxtypes.constant';

export const getTreesAction = () => ({
  type: types.GET_TREES,
});

export const updateStatusAction = (
  id,
  status,
  reason,
  addnote,
  uploadPath,
) => ({
  type: types.UPDATE_TREES_STATUS,
  treeId: id,
  status: status,
  reason: reason,
  remarks: addnote,
  uploadPath: uploadPath,
});
