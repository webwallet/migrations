module.exports = () => `
call apoc.periodic.commit(
  "match ()-->(index:Index) with index limit {limit} detach delete index return count(*)",
  {limit: 100}
)
`
