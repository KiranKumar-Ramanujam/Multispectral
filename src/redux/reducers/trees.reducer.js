import {types} from '../../constants/reduxtypes.constant';

const initialState = {
  Trees_Test: [],
};

function tree_reducer(state = initialState, action) {
  switch (action.type) {
    case types.UPDATE_TREES_STATUS: {
      const index = state.Trees_Test.findIndex(
        Trees_Test => Trees_Test.treeId == action.treeId,
      );
      const newArray = [...state.Trees_Test];
      newArray[index].status = action.status;
      newArray[index].reason = action.reason;
      newArray[index].remarks = action.remarks;
      newArray[index].uploadPath = action.uploadPath;

      return {
        ...state,
        Trees_Test: newArray,
      };
    }

    default:
      return state;
  }
}

export default tree_reducer;
