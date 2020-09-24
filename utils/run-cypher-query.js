const { map } = require('rxjs/operators')
const convertPropertiesToNumber = require('./convert-properties-to-number')

module.exports = (counters) => {
  return function run(query, param, txn) {
    return txn.run(query(param))
      .records().pipe(map(record => convertPropertiesToNumber(record.get(param))))
      .toPromise().then(value => counters.queries[param] = value)
  
  }
}
