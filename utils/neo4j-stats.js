const { map, flatMap } = require('rxjs/operators')
const convertPropertiesToNumber = require('./convert-properties-to-number.js')

module.exports = function neo4jstats(txn, counters, moment) {
  return txn.run(`CALL apoc.meta.stats()`)
    .records().pipe(map(record => record.keys
      .map(key => ({[key]: record.get(key)}))
      .reduce((stats, stat) => ({stats, ...stat}), {})
    ))
    .pipe(flatMap(({ stats }) => {
      counters[moment] = convertPropertiesToNumber(stats)
      return of(stats)
    }))
}
