module.exports = (param) => `
call apoc.periodic.iterate(
  "match (address:Address)-[:Outputs]->(:Index)-[output:Points]->(transaction) return *",
  "merge (address)-[:Outputs {id: output.id}]->(transaction) delete output",
  {batchSize: 100}
) yield batch, operations return operations as ${param}
`
