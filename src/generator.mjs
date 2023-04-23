import fs from 'fs'
const books = JSON.parse(fs.readFileSync('./src/bible/_index.json', 'utf8'))

let booksWritten = 0

fs.mkdir('./dist/RVR1960', { recursive: true }, (err) => {
  if (err) {
    console.log(err)
  }
  console.log('Created [dist] Output Folder....')
})

books.forEach((book, index) => {
  fs.readFile(`./src/bible/${book.key}.txt`, 'utf-8', (error, data) => {
    if (error) {
      console.log(error)
      throw new Error(error)
    }

    const chapters = data.split('***\n').filter((chapter) => chapter !== '')
    const json = []

    chapters.forEach((chapter) => {
      const lines = chapter.split('\n').filter((line) => line !== '')
      json.push(lines)
    })

    fs.writeFile(
      `./dist/RVR1960/${book.key}.json`,
      JSON.stringify(json, null, 2),
      'utf-8',
      (error) => {
        if (error) {
          console.log(error)
        }

        // Extra info
        book.number = index + 1
        book.chapters = json.length
        book.verses = json.reduce((count, b) => count + b.length, 0)

        booksWritten += 1

        if (booksWritten === books.length) {
          createIndex(books)
        }
      }
    )
  })
})

function createIndex (books) {
  fs.writeFile(
    './dist/RVR1960/index.json',
    JSON.stringify(books, null, 2),
    'utf-8',
    () => {
      console.log('Bible Generated Successfully!')
    }
  )
}
