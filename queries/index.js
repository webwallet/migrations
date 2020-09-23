const countNodesByLabel = require('./count-nodes-by-label')
const renameClearsToInputs = require('./rename-clears-to-inputs')
const renameSpendsToSources = require('./rename-spends-to-sources')

module.exports = {
  countNodesByLabel,
  renameClearsToInputs,
  renameSpendsToSources
}
