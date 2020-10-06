module.exports = (label) => `
match (address:Address)-[output:Unspent]->(transaction:Transaction)
return address.id as address, address.symbol as symbol,
  (transaction.id + "::" + output.id) as pointer limit 1000
`
