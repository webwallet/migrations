const convertPropertiesToNumber = require('./convert-properties-to-number')

module.exports = (counters) => {
  return async function run(query, param, txn) {
    let result = await txn.run(query(param))
    let value = result.records.map(record => {
      return convertPropertiesToNumber(record.get(param))
    })

    counters.queries[param] = value
    return value
  }
}
