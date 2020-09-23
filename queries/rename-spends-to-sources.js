module.exports = () => `
call apoc.periodic.iterate(
  "match (:Transaction)-[rel:Spends]->(:Transaction) return rel",
  "call apoc.refactor.setType(rel, 'Sources') yield input, output return *",
  {batchSize: 100}
) yield batch, operations return operations as spendsToSources
`