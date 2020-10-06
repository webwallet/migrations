const queries = require('../queries')
const neo4jStats = require('../utils/neo4j-stats')
const runCypherQuery = require('../utils/run-cypher-query')
const mapUnspentOutputs = require('../utils/map-unspent-outputs')
const convertPropertiesToNumber = require('../utils/convert-properties-to-number')

async function run({ driver }) {
  const session = driver.session()
  let counters = {before: {}, after: {},queries: {}}
  let responses = {before: {}, after: {}}
  let runQuery = runCypherQuery(counters)
  let startTime = (new Date()).getTime()
  console.log('running migration...')

  // responses.before.unspentOutputs = await mapUnspentOutputs(driver, queries.unspentOutputsV1())
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
  // responses.after.unspentOutputs = await mapUnspentOutputs(driver, queries.unspentOutputsV2())

  console.log(counters.before)
  console.log(counters.after)
  console.log(counters.queries)

  await validateMigration({counters, responses})

  console.log('duration:', ((new Date()).getTime() - startTime)/1000)
}

async function validateMigration({ counters, responses }) {
  let validations = {
    nodes: {
      addresses: counters.before.labels.Address === counters.after.labels.Address,
      transactions: counters.before.labels.Transaction === counters.after.labels.Transaction,
      ious: counters.before.labels.IOU === counters.after.labels.IOU,
      noIndexes: !counters.after.labels.Index
    },
    rels: {
      addressOutputs: counters.before.relTypes['(:Index)-[:Points]->()']
                   === counters.after.relTypes['(:Address)-[:Outputs]->()'],
      addressUnspents: counters.before.relTypes['(:Index)-[:Unspent]->()']
                   === counters.after.relTypes['(:Address)-[:Unspent]->()'],
      spendsToSources: counters.before.relTypes['(:Transaction)-[:Spends]->()']
                    === counters.after.relTypes['(:Transaction)-[:Sources]->()'],
      pointsToOutputs: counters.before.relTypes['()-[:Points]->(:Transaction)']
                    === counters.after.relTypes['()-[:Outputs]->(:Transaction)'],
      unspentOutputs: counters.before.relTypes['()-[:Unspent]->(:Transaction)']
                   === counters.after.relTypes['()-[:Unspent]->(:Transaction)'],
      iouClearsToInputs: counters.before.relTypes['()-[:Clears]->(:IOU)']
                      === counters.after.relTypes['()-[:Inputs]->(:IOU)'],
    }
  }

  // console.log(Object.keys(responses.after.unspentOutputs).length,
  //   Object.values(responses.after.unspentOutputs).reduce((acc, val) => acc + val.length, 0))

  console.log(validations)
  return validations
}

module.exports = {
  run
}
