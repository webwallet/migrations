module.exports = function propertiesToNumber(object) {
  if (object.toNumber) return object.toNumber()

  let numbered = {}
  Object.entries(object).map(([key, value]) => {
    if (value.toNumber) {
      numbered[key] = value.toNumber()
    } else if (typeof value === 'object') {
      numbered[key] = propertiesToNumber(value)
    } else {
      numbered[key] = value
    }
  })

  return numbered
}
