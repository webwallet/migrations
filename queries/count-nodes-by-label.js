module.exports = function countNodesByLabel(label) {
  return `match (node:${label}) return count(node) as nodeCount`
}
