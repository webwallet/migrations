const { map } = require('rxjs/operators')
const convertPropertiesToNumber = require('./convert-properties-to-number')

module.exports = function run(query, variable, txn) {
  return txn.run(query)
    .records().pipe(map(record => convertPropertiesToNumber(record.get(variable))))
}
