module.exports = (param) => `
call apoc.periodic.iterate(
  "match (address:Address)-[symbol:Outputs]->(index:Index)-[output:Unspent]->(transaction) return *",
  "remove index:Index set index:Address set index.id = address.id  set index.symbol = symbol.id",
  {batchSize: 100}
) yield batch, operations return operations as ${param}
`

// "merge (address)-[:Unspent {id: toInteger(output.id)}]->(transaction) delete output",
