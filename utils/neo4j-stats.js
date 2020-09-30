const convertPropertiesToNumber = require('./convert-properties-to-number.js')

module.exports = async function neo4jstats(txn, counters, moment) {
  let result = await txn.run(`CALL apoc.meta.stats()`)
  let stats = result.records.map(record => {
    return record.keys
      .map(key => ({[key]: record.get(key)}))
      .reduce((stats, stat) => ({stats, ...stat}), {})
  }).map(({ stats }) => convertPropertiesToNumber(stats))
  
  counters[moment] = stats[0]
  return counters[moment]
}
