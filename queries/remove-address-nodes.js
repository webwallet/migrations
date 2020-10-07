module.exports = (param) => `
call apoc.periodic.iterate(
  "match (:Index)-[:Address]->(address) return address",
  "detach delete address",
  {batchSize: 100}
) yield batch, operations return operations as ${param}
`
