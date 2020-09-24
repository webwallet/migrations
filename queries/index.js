const countNodesByLabel = require('./count-nodes-by-label')

const bypassAddressIndex = require('./bypass-address-index')
const bypassPointsOutputs = require('./bypass-points-outputs')
const bypassUnspentOutputs = require('./bypass-unspent-outputs')

const renameClearsToInputs = require('./rename-clears-to-inputs')
const renameSpendsToSources = require('./rename-spends-to-sources')
const removeIndexNodes = require('./remove-index-nodes')

module.exports = {
  countNodesByLabel,
  bypassAddressIndex,
  bypassPointsOutputs,
  bypassUnspentOutputs,
  renameClearsToInputs,
  renameSpendsToSources,
  removeIndexNodes
}
