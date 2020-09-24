module.exports = (label) => `
match (node:${label}) return count(node) as ${label}
`
