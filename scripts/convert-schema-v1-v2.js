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

  let createIOUConstraint = await session.writeTransaction(async txn => {
    return await runQuery(queries.createIOUConstraint, 'createIOUConstraint', txn)
  })

  responses.before.unspentOutputs = await mapUnspentOutputs(driver, queries.unspentOutputsV1())
  let neo4jStatsBefore = await neo4jStats(session, counters, 'before')

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

  let removeAddressNodes = await session.writeTransaction(async txn => {
    return await runQuery(queries.removeAddressNodes, 'removeAddressNodes', txn)
  })
  console.log(removeAddressNodes)

  let removeIndexNodes = await session.writeTransaction(async txn => {
    let result = await txn.run(queries.removeIndexNodes())
    let value = result.records.map(record => convertPropertiesToNumber(record.get('updates')))
    counters.queries['indexNodes'] = value
  
    return value
  })

  let createAddressConstraint = await session.writeTransaction(async txn => {
    return await runQuery(queries.createAddressConstraint, 'createAddressConstraint', txn)
  })

  let neo4jStatsAfter = await neo4jStats(session, counters, 'after')
  responses.after.unspentOutputs = await mapUnspentOutputs(driver, queries.unspentOutputsV2())

  console.log('before:', counters.before)
  console.log('after:', counters.after)
  console.log('queries:', counters.queries)

  await validateMigration({counters, responses})

  console.log('duration:', ((new Date()).getTime() - startTime)/1000)
}

async function validateMigration({ counters, responses }) {
  let validations = {
    nodes: {
      addresses: counters.before.relTypes['(:Address)-[:Outputs]->()'] === counters.after.labels.Address, //
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
    },
    matches: {
      unspentBefore: Object.values(responses.before.unspentOutputs).reduce((count, array) => count + array.length, 0),
      unspentAfter: Object.values(responses.after.unspentOutputs).reduce((count, array) => count + array.length, 0),
      unspentStrings: compareKeysAndArrayValues(responses.before.unspentOutputs, responses.after.unspentOutputs),
      unspentTotal: counters.before.relTypes['()-[:Unspent]->(:Transaction)']
    }
  }

  // console.log(Object.keys(responses.after.unspentOutputs).length,
  //   Object.values(responses.after.unspentOutputs).reduce((acc, val) => acc + val.length, 0))

  console.log(validations)
  return validations
}

function compareKeysAndArrayValues(objectBefore, objectAfter) {
  let totalMatched = 0

  Object.entries(objectBefore).forEach(([keyBefore, arrayBefore]) => {
    let arrayAfter = objectAfter[keyBefore]
    if (arrayAfter && arrayAfter.length === arrayBefore.length) {
      arrayBefore.forEach(elementBefore => {
        if (arrayAfter.includes(elementBefore)) {
          totalMatched += 1
        }
      })
    }
  })

  return totalMatched
}

module.exports = {
  run
}
