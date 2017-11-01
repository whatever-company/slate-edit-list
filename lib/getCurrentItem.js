
/**
 * Return the current list item, from current selection or from a node.
 *
 * @param {PluginOptions} opts
 * @param {Slate.Value} value
 * @param {Slate.Block} block?
 * @return {Slate.Block || Void}
 */
function getCurrentItem(opts, value, block) {
    const { document } = value;

    if (!block) {
        if (!value.selection.startKey) return null;
        block = value.startBlock;
    }

    if (block.type === opts.typeItem) {
        return block;
    }

    const parent = document.getParent(block.key);
    return (parent && parent.type === opts.typeItem)
        ? parent
        : null;
}

module.exports = getCurrentItem;
