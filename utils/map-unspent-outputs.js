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
        let [address, pointer] = ['address', 'pointer'].map(key => record.get(key))
        return outputs[address] = [...(outputs[address] || []), pointer]
      }),
      concat(rxSession.close())
    )
    .toPromise()
    .then(() => outputs)
}