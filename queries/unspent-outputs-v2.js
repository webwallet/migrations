module.exports = (label) => `
match (address:Address)-[output:Unspent]->(transaction:Transaction)
return address.id as address, transaction.id + "::" + output.id as pointer
`
