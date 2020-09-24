module.exports = (param) => `
call apoc.periodic.iterate(
  "match (:Transaction)-[spends:Spends]->(:Transaction) return spends",
  "call apoc.refactor.setType(spends, 'Sources') yield input, output return *",
  {batchSize: 100}
) yield batch, operations return operations as ${param}
`
