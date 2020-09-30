const queries = require('../queries')
const neo4jStats = require('../utils/neo4j-stats')
const runCypherQuery = require('../utils/run-cypher-query')
const convertPropertiesToNumber = require('../utils/convert-properties-to-number')

async function run({ driver }) {
  const session = driver.session()
  let counters = {before: {}, after: {},queries: {}}
  let runQuery = runCypherQuery(counters)
  let startTime = (new Date()).getTime()
  console.log('running migration...')

  let neo4jStatsBefore = await neo4jStats(session, counters, 'before')

  let bypassAddressIndex = await session.writeTransaction(async txn => {
    return await runQuery(queries.bypassAddressIndex, 'addressIndex', txn)
  })
  console.log(bypassAddressIndex)

  let bypassUnspentOutputs = await session.writeTransaction(async txn => {
    return await runQuery(queries.bypassUnspentOutputs, 'bypassUnspent', txn)
  })
  console.log(bypassUnspentOutputs)

  let bypassPointsOutputs = await session.writeTransaction(async txn => {
    return await runQuery(queries.bypassPointsOutputs, 'bypassOutputs', txn)
  })
  console.log(bypassPointsOutputs)

  let renameSpendsToSources = await session.writeTransaction(async txn => {
    return await runQuery(queries.renameSpendsToSources, 'spendsToSources', txn)
  })
  console.log(renameSpendsToSources)

  let renameClearsToInputs = await session.writeTransaction(async txn => {
    return await runQuery(queries.renameClearsToInputs, 'clearsToInputs', txn)
  })
  console.log(renameClearsToInputs)

  let removeIndexNodes = await session.writeTransaction(async txn => {
    let result = await txn.run(queries.removeIndexNodes())
    let value = result.records.map(record => convertPropertiesToNumber(record.get('updates')))
    counters.queries['indexNodes'] = value
  
    return value
  })

  let neo4jStatsAfter = await neo4jStats(session, counters, 'after')


  console.log(counters)
  console.log('duration:', ((new Date()).getTime() - startTime)/1000)
}

module.exports = {
  run
}
