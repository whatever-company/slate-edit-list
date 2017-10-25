const Slate = require('slate');
const getItemDepth = require('../getItemDepth');
const getCurrentItem = require('../getCurrentItem');
const isList = require('../isList');
const unwrapList = require('./unwrapList');

/**
 * Decreases the depth of the current item. The following items will
 * be moved as sublist of the decreased item.
 *
 * No-op for root items.
 *
 * @param  {PluginOptions} opts
 * @param  {Change} transform
 * @param  {Change} an optional block to affect
 * @return {Change}
 */
function decreaseItemDepth(opts, change, block) {
    const { state } = change;
    const { document } = state;

    const currentItem = getCurrentItem(opts, state, block);
    const currentList = document.getParent(currentItem.key);
    const parentItem = document.getParent(currentList.key);

    // If we're trying to decrease the depth of a root item, unwrap it
    // from the list instead.
    const depth = getItemDepth(opts, state, block);
    if (depth == 1 && !isList(opts, parentItem)) {
        return unwrapList(opts, change, block);
    }

    const parentList = isList(opts, parentItem) ? parentItem : document.getParent(parentItem.key);
    const index = (parentItem === parentList) ? 0 : (parentList.nodes.indexOf(parentItem) + 1)

    // The items following the item will be moved to a sublist of currentItem
    const followingItems = currentList.nodes
              .skipUntil(i => i === currentItem)
              .rest();

    // True if the currentItem and the followingItems make the whole
    // currentList, and hence the currentList will be emptied
    const willEmptyCurrentList = currentList.nodes.size === followingItems.size + 1;

    if (!followingItems.isEmpty()) {
        // Add them as sublist of currentItem
        const sublist = Slate.Block.create({
            kind: 'block',
            type: currentList.type,
            data: currentList.data
        });
        // Add the sublist
        change.insertNodeByKey(
            currentItem.key, currentItem.nodes.size, sublist, { normalize: false }
        );

        change.moveNodeByKey(
          currentItem.key, parentList.key, index, { normalize: false }
        );

        // Move the followingItems to the sublist
        followingItems.forEach((item, index) => change.moveNodeByKey(
          item.key,
          sublist.key,
          sublist.nodes.size + index,
          { normalize: false }
        ));
    } else {
        change.moveNodeByKey(
          currentItem.key, parentList.key, index
        );
    }

    // Remove the currentList completely if needed
    if (willEmptyCurrentList) {
        change.removeNodeByKey(currentList.key);
    }

    return change;
}

module.exports = decreaseItemDepth;
