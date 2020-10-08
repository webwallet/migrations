const countNodesByLabel = require('./count-nodes-by-label')

const bypassAddressIndex = require('./bypass-address-index')
const bypassPointsOutputs = require('./bypass-points-outputs')
const bypassUnspentOutputs = require('./bypass-unspent-outputs')

const renameClearsToInputs = require('./rename-clears-to-inputs')
const renameSpendsToSources = require('./rename-spends-to-sources')

const createIOUConstraint = require('./create-iou-constraint')
const createAddressConstraint = require('./create-address-constraint')

const removeAddressNodes = require('./remove-address-nodes')
const removeIndexNodes = require('./remove-index-nodes')

const unspentOutputsV1 = require('./unspent-outputs-v1')
const unspentOutputsV2 = require('./unspent-outputs-v2')

module.exports = {
  countNodesByLabel,
  bypassAddressIndex,
  bypassPointsOutputs,
  bypassUnspentOutputs,
  renameClearsToInputs,
  renameSpendsToSources,
  createIOUConstraint,
  createAddressConstraint,
  removeAddressNodes,
  removeIndexNodes,
  unspentOutputsV1,
  unspentOutputsV2
}
