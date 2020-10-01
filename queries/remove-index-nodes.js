module.exports = () => `
call apoc.periodic.commit(
  "match ()-->(index:Index) with index limit {limit} detach delete index return count(*)",
  {limit: 100}
)
`
// module.exports = (param) => `
// call apoc.periodic.iterate(
//   "match (index:Index) return index",
//   "detach delete index",
//   {batchSize: 100}
// ) yield batch, operations return operations as ${param}
// `
