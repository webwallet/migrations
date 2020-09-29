const { map } = require('rxjs/operators')
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

// module.exports = (counters) => {
//   return function run(query, param, txn) {
//     return txn.run(query(param))
//       .records().pipe(map(record => {
//         return convertPropertiesToNumber(param ? record.get(param) : record.get('updates'))
//       }))
//       .toPromise().then(value => counters.queries[param] = value)
//   }
// }
