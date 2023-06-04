import { types }  from '../../constants/reduxtypes.constant'

    export const FilterDropdownLabelAction = ( region_label, estate_group_label, estate_label, afdeling_label, block_label) => (
        dispatch, getState) =>
        {
        dispatch(FilterDropdownLabelActive( region_label, estate_group_label, estate_label, afdeling_label, block_label));
        };
        const FilterDropdownLabelActive = ( region_label, estate_group_label, estate_label, afdeling_label, block_label) => dispatch => 
        {
        dispatch({
        type: types.FILTERDROPDOWN_LABEL,
        region_label: region_label,
        estate_group_label: estate_group_label,
        estate_label: estate_label,
        afdeling_label: afdeling_label,
        block_label: block_label

        });
        };