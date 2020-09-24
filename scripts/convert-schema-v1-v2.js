const { of, concat, throwError } = require('rxjs')
const { flatMap, catchError } = require('rxjs/operators')

const queries = require('../queries')
const neo4jStats = require('../utils/neo4j-stats')
const runCypherQuery = require('../utils/run-cypher-query')


async function run({ driver }) {
  const rxjsSession = driver.rxSession()
  console.log('running migration...')
  let counters = {before: {}, after: {},queries: {}}
  let run = runCypherQuery(counters)

  concat(
    neo4jStats(rxjsSession, counters, 'before').toPromise(),
    rxjsSession.beginTransaction()
      .pipe(
        flatMap(txn =>
          concat(
            run(queries.countNodesByLabel, 'Transaction', txn),
            run(queries.bypassAddressIndex, 'addressIndex', txn),
            run(queries.bypassPointsOutputs, 'bypassOutputs', txn),
            run(queries.bypassUnspentOutputs, 'bypassUnspent', txn),
            run(queries.renameSpendsToSources, 'spendsToSources', txn),
            run(queries.renameClearsToInputs, 'clearsToInputs', txn),
            run(queries.removeIndexNodes, 'removeIndexes', txn),
            neo4jStats(txn, counters, 'after'),
            txn.rollback(),
            of('committed')
          )
          .pipe(catchError(err => txn.rollback().pipe(throwError(err))))
        )
      )
      .subscribe({
        next: data => console.log('...'),
        complete: () => console.log('completed', counters),
        error: error => console.log(error)
      })
  )
}

module.exports = {
  run
}
