import { AuthorBook } from './../../entity/AuthorBook'
import { Author } from './../../entity/Author'
import { Connection } from 'typeorm'
import faker from 'faker'

// import { testConn } from '../../../test-utils/testConn'
// import { gCall } from '../../../test-utils/gCall'
import { Book } from '../../../src/entity/Book'
import { testConn } from '../../../src/test-utils/testConn'
import { gCall } from '../../../src/test-utils/gCall'

let conn: Connection
beforeAll(async () => {
  conn = await testConn()
})
afterAll(async () => {
  await conn.close()
})

const booksWithoutAuthorsQuery = `
{
  books{
    id
    name
    pageCount
  }
}
`
const booksWithAuthorsQuery = `
{
  books{
    id
    name
    pageCount
  }
}
`

describe('Get books', () => {
  it('get book without', async () => {
    const book = await Book.create({
      name: faker.random.word(),
      pageCount: faker.random.number(),
    }).save()

    const response = await gCall({
      source: booksWithoutAuthorsQuery,
    })

    expect(response).toMatchObject({
      data: {
        books: [
          {
            id: `${book.id}`,
            name: book.name,
            pageCount: book.pageCount,
          },
        ],
      },
    })
  })

  it('get book with author', async () => {
    const author = await Author.create({
      name: faker.name.firstName(),
    }).save()

    const book = await Book.create({
      name: faker.random.word(),
      pageCount: faker.random.number(),
    }).save()

    await AuthorBook.create({
      authorId: author.id,
      bookId: book.id,
    }).save()

    const response = await gCall({
      source: booksWithAuthorsQuery,
    })

    expect(response).toContainEqual(
      expect.objectContaining({
        data: {
          books: [
            {
              id: `${book.id}`,
              name: book.name,
              pageCount: book.pageCount,
              authors: [
                {
                  id: author.id,
                  name: author.name,
                },
              ],
            },
          ],
        },
      })
    )
  })
})

describe('Create book mutation', () => {
  it('create book successfully', async () => {
    const bookName = faker.random.word()
    const pageCount = faker.random.number()
    const createAuthorMutation = `
    mutation {
      createBook(name:"${bookName}", pageCount:${pageCount}) {
          name
          pageCount
        }
    }
  `
    const response = await gCall({
      source: createAuthorMutation,
    })

    expect(response).toMatchObject({
      data: {
        createBook: {
          name: bookName,
          pageCount: pageCount,
        },
      },
    })
  })
})

describe('Create author mutation', () => {
  it('create author successfully', async () => {
    const authorName = faker.random.word()
    const createBookMutation = `
    mutation{
        createAuthor(name:"${authorName}"){
          name
        }
    }
  `
    const response = await gCall({
      source: createBookMutation,
    })

    expect(response).toMatchObject({
      data: {
        createAuthor: {
          name: authorName,
        },
      },
    })
  })
})
