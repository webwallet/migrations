module.exports = (param) => `
call apoc.periodic.iterate(
  "match (:Transaction)-[clears:Clears]->(:IOU) return clears",
  "call apoc.refactor.setType(clears, 'Inputs') yield input, output return *",
  {batchSize: 100}
) yield batch, operations return operations as ${param}
`
