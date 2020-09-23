module.exports = () => `
call apoc.periodic.iterate(
  "match (:Transaction)-[rel:Clears]->(:IOU) return rel",
  "call apoc.refactor.setType(rel, 'Inputs') yield input, output return *",
  {batchSize: 100}
) yield batch, operations return operations as clearsToInputs
`