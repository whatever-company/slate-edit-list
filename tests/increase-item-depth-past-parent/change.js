
module.exports = function(plugin, change) {
    const { state } = change;
    return plugin.changes.increaseItemDepth(change);
};
