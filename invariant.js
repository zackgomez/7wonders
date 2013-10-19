var invariant_violation = function(message) {
  throw new Error(message);
}
var invariant = function(cond, message) {
  if (!cond) {
    invariant_violation(message);
  }
}
invariant.invariant_violation = invariant_violation;

module.exports = invariant;
