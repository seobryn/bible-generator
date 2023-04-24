import fs from 'fs'
const books = JSON.parse(fs.readFileSync('./src/bible/_index.json', 'utf8'))

const exportTemplate = fs.readFileSync('./src/templates/server.txt', 'utf8')

// Delete Dist forlder if exists
if (fs.existsSync('./dist')) {
  fs.rmSync('./dist', { recursive: true, force: true })
}

// Create Dist folder empty
fs.mkdirSync('./dist/RVR1960', { recursive: true }, (err) => {
  if (err) {
    console.log(err)
  }
  console.log('Created [dist] Output Folder....')
})

// Iterate books index to get all the Bible books
books.forEach((book, index) => {
  fs.readFile(`./src/bible/${book.key}.txt`, 'utf-8', (error, data) => {
    if (error) {
      console.error(error)
      process.exit(1)
    }

    const chapters = data.split('***\n').filter((chapter) => chapter !== '')
    const json = []

    chapters.forEach((chapter, idx) => {
      const verses = chapter.split('\n').filter((line) => line !== '')

      json.push({
        chapter: idx + 1,
        verses: verses.map((line, index) => ({
          verse: index + 1,
          content: line
        }))
      })
    })

    fs.writeFile(
      `./dist/RVR1960/${book.key}.json`,
      JSON.stringify(json, null, 2),
      'utf-8',
      (error) => {
        if (error) {
          console.log(error)
          process.exit(1)
        }

        // Extra info
        book.number = index + 1
        book.chapters = json.length
        book.verses = json.reduce((count, b) => count + b.length, 0)
      }
    )
  })
})

createIndex(books)

function createIndex (books) {
  fs.writeFile(
    './dist/RVR1960/index.json',
    JSON.stringify(books, null, 2),
    'utf-8',
    () => {
      console.log('Bible Generated Successfully!')
    }
  )

  let importSection = books.reduce((content, book) => {
    content += `const ${book.key} =  require('./RVR1960/${book.key}.json')\n`
    return content
  }, '')
  importSection += "const index = require('./RVR1960/index.json')\n"

  let exportSection = books.reduce((content, book) => {
    content += `${book.key}: ${book.key},\n`
    return content
  }, '')
  exportSection += 'index: index,'

  let template = exportTemplate.replace('/**{BIBLE_IMPORTS}**/', importSection.trim())
  template = template.replace('/**{BIBLE_EXPORTS}**/', exportSection.trim())

  fs.writeFile(
    './dist/index.js',
    template,
    (error) => {
      if (error) {
        console.log(error)
        process.exit(1)
      }

      console.log('Exported Server File Successfully!')
    }
  )
}
