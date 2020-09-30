module.exports = (param) => `
call apoc.periodic.iterate(
  "match (address:Address)-[:Outputs]->(:Index)-[output:Unspent]->(transaction) return *",
  "merge (address)-[:Unspent {id: toInteger(output.id)}]->(transaction) delete output",
  {batchSize: 100}
) yield batch, operations return operations as ${param}
`
