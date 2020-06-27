import { ApolloServer } from 'apollo-server-express'
import cors from 'cors'
import Express from 'express'
import 'reflect-metadata'
import { formatArgumentValidationError, useContainer } from 'type-graphql'
import { Container } from 'typedi'
import * as typeorm from 'typeorm'
import { createConnection } from 'typeorm'
import { createAuthorsLoader } from './utils/authorsLoader'
import { createSchema } from './utils/createSchema'

useContainer(Container)
typeorm.useContainer(Container)

const main = async () => {
  await createConnection()

  const schema = await createSchema()

  const apolloServer = new ApolloServer({
    schema,
    formatError: formatArgumentValidationError,
    context: ({ req, res }: any) => ({
      req,
      res,
      authorsLoader: createAuthorsLoader(),
    }),
    validationRules: [
      // queryComplexity({
      //   // The maximum allowed query complexity, queries above this threshold will be rejected
      //   maximumComplexity: 8,
      //   // The query variables. This is needed because the variables are not available
      //   // in the visitor of the graphql-js library
      //   variables: {},
      //   // Optional callback function to retrieve the determined query complexity
      //   // Will be invoked weather the query is rejected or not
      //   // This can be used for logging or to implement rate limiting
      //   onComplete: (complexity: number) => {
      //     console.log("Query Complexity:", complexity);
      //   },
      //   estimators: [
      //     // Using fieldConfigEstimator is mandatory to make it work with type-graphql
      //     fieldConfigEstimator(),
      //     // This will assign each field a complexity of 1 if no other estimator
      //     // returned a value. We can define the default value for field not explicitly annotated
      //     simpleEstimator({
      //       defaultComplexity: 1
      //     })
      //   ]
      // }) as any
    ],
  })

  const app = Express()

  app.use(
    cors({
      credentials: true,
      origin: 'http://localhost:3000',
    })
  )

  apolloServer.applyMiddleware({ app, cors: false })

  app.listen(4000, () => {
    console.log('server started on http://localhost:4000/graphql')
  })
}

main().catch((err) => console.error(err))
