module.exports = (label) => `
match (countspace:Countspace)-[:Addresses]->(:Index)-[pointer:Address]->(address:Address)
match (address:Address)-[:Outputs]->(:Index)-[output:Unspent]->(transaction)
return address.id as address, countspace.id as symbol,
  (transaction.id + "::" + output.id) as pointer
`
