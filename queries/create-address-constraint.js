module.exports = (param) => `
CREATE CONSTRAINT ON (address:Address) ASSERT (address.id, address.symbol) IS NODE KEY
`
