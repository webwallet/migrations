module.exports = (param) => `
call apoc.periodic.iterate(
  "match (address:Address)-[:Outputs]->(:Index)-[unspent:Unspent]->(transaction) return *",
  "call apoc.refactor.from(unspent, address) yield input, output return *",
  {batchSize: 100}
) yield batch, operations return operations as ${param}
`
