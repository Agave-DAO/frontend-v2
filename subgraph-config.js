// eslint-disable-next-line @typescript-eslint/no-var-requires
const { loadEnvConfig } = require('@next/env')

// eslint-disable-next-line @typescript-eslint/no-var-requires
const endpoints = require('./src/subgraph/subgraph-endpoints.json')

if (Object.keys(endpoints).length) {
  loadEnvConfig(process.cwd())

  const codeGenOutDir = 'types/generated/subgraph.ts'

  const schemas = Object.values(endpoints).reduce((acc, current) => {
    return [...acc, ...Object.values(current)]
  }, [])

  module.exports = {
    overwrite: true,
    schema: schemas,
    documents: 'src/subgraph/queries/**/*.ts',
    generates: {
      [codeGenOutDir]: {
        plugins: [
          'typescript',
          'typescript-operations',
          'typescript-graphql-request',
          'plugin-typescript-swr',
        ],
      },
    },
    config: {
      rawRequest: false,
      autogenSWRKey: true,
    },
  }
}
