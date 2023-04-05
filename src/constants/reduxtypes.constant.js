export const types = {
  TOGGLE_SWITCH_ACTIVE: 'TOGGLE_SWITCH_ACTIVE',
  FILTERDROPDOWN_LABEL: 'FILTERDROPDOWN_LABEL',
  GET_TREES: 'GET_TREES',
  UPDATE_TREES_STATUS: 'UPDATE_TREES_STATUS',
};

export const actionTypes = prefix => {
  return {
    REQUEST: `${prefix}_REQUEST`,
    SUCCESS: `${prefix}_SUCCESS`,
    FAILURE: `${prefix}_FAILURE`,
    prefix,
  };
};
