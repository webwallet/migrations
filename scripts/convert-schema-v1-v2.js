const queries = require('../queries')
const neo4jStats = require('../utils/neo4j-stats')

async function run({ driver }) {
  const rxjsSession = driver.rxSession()
  console.log('running migration...')
}

module.exports = {
  run
}