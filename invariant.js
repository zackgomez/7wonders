var invariant = function (cond, message) {
  if (!cond) {
    throw new Error(message);
  }
}

module.exports = invariant;
