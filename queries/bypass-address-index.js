module.exports = (param) => `
call apoc.periodic.iterate(
  "match (:Countspace)-[pointer:Addresses]->(:Index)-[:Address]->(address:Address) return *",
  "call apoc.refactor.to(pointer, address) yield input, output return *",
  {batchSize: 100}
) yield batch, operations return operations as ${param}
`
