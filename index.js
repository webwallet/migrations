const neo4j = require('neo4j-driver')
const { of, concat, throwError, empty } = require('rxjs')
const { map, pipe, flatMap, catchError } = require('rxjs/operators')

const convertSchemaV1toV2 = require('./scripts/convert-schema-v1-v2')

const driver = neo4j.driver(
  'bolt://localhost',
  neo4j.auth.basic('neo4j', 'euler')
)

convertSchemaV1toV2.run({driver})
