module.exports = (param) => `
call apoc.periodic.iterate(
  "match (countspace:Countspace)-[:Addresses]->(:Index)-[pointer:Address]->(address:Address) return *",
  "set address.symbol = countspace.id delete pointer",
  {batchSize: 100}
) yield batch, operations return operations as ${param}
`
// "merge (space)-[:Addresses]->(address) delete pointer",

// module.exports = (limit) => `
// call apoc.periodic.commit(
//   "match (space:Countspace)-[:Addresses]->(:Index)-[:Address]->(address:Address) return *",
//   {limit: 100}
// )
// `

// "call apoc.refactor.to(pointer, address) yield input, output return *",
