import { BooksController } from './controllers/Books.controller.mjs'

;(async () => {
  const [bibleVersion, alsoExportJS] = process.argv.slice(2)

  if (!bibleVersion) {
    throw new Error('Missing Bible Version')
  }

  const bookController = new BooksController(bibleVersion)
  await bookController.processBooks()
  if (alsoExportJS === '--exportJS') {
    await bookController.exportJS()
  }
})()
