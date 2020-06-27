import { testConn } from './testConn'

testConn(true)
  .then(() => process.exit())
  .catch((err) => console.log(`Error connecting to test DB: ${err}`))
