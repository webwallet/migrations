const { of } = require('rxjs')
const { map, concat } = require('rxjs/operators')

module.exports = (driver, query) => {
  let rxSession = driver.rxSession()
  let outputs = {}

  return rxSession
    .run(query, {})
    .records()
    .pipe(
      map(record => {
        let [address, symbol, pointer] = ['address', 'symbol', 'pointer'].map(key => record.get(key))
        let addressSymbolKey = [address, symbol].join('::')
        return outputs[addressSymbolKey] = [...(outputs[addressSymbolKey] || []), pointer]
      }),
      concat(rxSession.close())
    )
    .toPromise()
    .then(() => outputs)
}