module.exports = (label) => `
match (index:Index)-[output:Unspent]->(transaction:Transaction)
match (index)--(address:Address)
return address.id as address, transaction.id + '::' + output.id as pointer
`
