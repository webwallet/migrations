module.exports = (param) => `
call apoc.periodic.iterate(
  "match (index:Index) return index",
  "detach delete index",
  {batchSize: 100}
) yield batch, operations return operations as ${param}
`
