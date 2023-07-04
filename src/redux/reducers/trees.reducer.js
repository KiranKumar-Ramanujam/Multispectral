import {types} from '../../constants/reduxtypes.constant';
import RNFS from 'react-native-fs';

import SQLite from 'react-native-sqlcipher';

const initialState = {
  Trees_Test: [],
};

let dbName = 'multispectral.db';
const db = SQLite.openDatabase(
  {name: RNFS.ExternalDirectoryPath + '/' + dbName, key: '1234567890'},
  () => {},
  error => {
    console.log(error);
  },
);

function tree_reducer(state = initialState, action) {
  switch (action.type) {
    case types.GET_TREES: {
      const trees = [];
      try {
        db.transaction(tx => {
          tx.executeSql(
            // 'SELECT l.treeId,l.blockId,l.blockName,l.latitude,l.longitude,l.yearOfPlanting,l.predictionId, l.droneImageId, l.compressedImagePath, l.nw_latitude, l.nw_logitude, l.se_latitude, l.se_longitude, l.prediction, l.afdelingId, l.afdelingName, l.estateId, l.estateName, l.estateGroupId, l.regionId, l.validated_verificationId, l.validated_status, max(r.verificationId),r.userId,r.status, r.remarks, v.verificationImageId, v.uploadPath FROM MDB_trees l LEFT JOIN MDB_manual_verification r ON l.predictionId = r.predictionId LEFT JOIN MDB_verification_image v ON v.verificationId = r.verificationId GROUP BY l.treeId',
            `SELECT l.treeId,l.blockId,l.blockName,l.latitude,l.longitude,l.yearOfPlanting,l.predictionId, l.droneImageId, l.compressedImagePath, l.nw_latitude, l.nw_logitude, l.se_latitude, l.se_longitude, l.prediction, l.afdelingId, l.afdelingName, l.estateId, l.estateName, l.estateGroupId, l.regionId, l.validated_verificationId, l.validated_status, l.validated_remarks, l.validated_pestDiseaseId, max(r.verificationId),r.userId,r.status, r.remarks, v.verificationImageId, v.uploadPath FROM MDB_trees l LEFT JOIN MDB_manual_verification r ON l.predictionId = r.predictionId LEFT JOIN MDB_verification_image v ON v.verificationId = r.verificationId GROUP BY l.treeId`,
            [],
            (tx, results) => {
              var len = results.rows.length;
              if (len > 0) {
                for (let i = 0; i < results.rows.length; ++i)
                  trees.push(results.rows.item(i));
              }
            },
          );
        });
      } catch (error) {
        console.log(error);
      }

      return {Trees_Test: trees};
    }

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
