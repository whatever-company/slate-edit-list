const getCurrentItem = require('../getCurrentItem');

/**
 * Split a list item at the start of the current range.
 *
 * @param  {Object} opts
 * @param  {Slate.Change} change
 * @return {Slate.Change}
 */
function splitListItem(opts, change) {
    const { state } = change;
    const currentItem = getCurrentItem(opts, state);
    const splitOffset = state.startOffset;

    change = change.splitDescendantsByKey(currentItem.key, state.startKey, splitOffset);
    state.activeMarks.forEach((mark) => {
        change = change.addMark(mark);
    });
    return change;
}

module.exports = splitListItem;
