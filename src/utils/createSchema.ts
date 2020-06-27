import { buildSchema } from 'type-graphql'
import { AuthorBookResolver } from '../modules/author-book/AuthorBookResolver'
import { AuthorDataMapper } from '../modules/author-book/AuthorDataMapper'

export const createSchema = () =>
  buildSchema({
    resolvers: [AuthorBookResolver, AuthorDataMapper],
    authChecker: ({ context: { req } }) => {
      return !!req.session.userId
    },
  })
