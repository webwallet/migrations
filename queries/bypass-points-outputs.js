module.exports = (param) => `
call apoc.periodic.iterate(
  "match (address:Address)-[pointer:Points]->(transaction) return *",
  "call apoc.refactor.setType(pointer, 'Outputs') yield input, output return *",
  {batchSize: 100}
) yield batch, operations return operations as ${param}
`

//"merge (address)-[:Outputs {id: toInteger(output.id)}]->(transaction) delete output",
