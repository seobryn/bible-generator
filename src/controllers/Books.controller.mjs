import fs from 'fs'

/**
 * @typedef {Chapter[]} Book
 * @typedef {{ chapter: number, verses: Verse[], title?: string }} Chapter
 * @typedef {{ verse: number, content: string, title?:string, reference?: string }} Verse
 * @typedef {{"testament": string,"title": string,"shortTitle": string,"abbr": string,"category": string,"key": string}} BookIndex
 */

export class BooksController {
  /** @type {string} */
  version
  /** @type {BookIndex} */
  index

  /**
   * @param {string} version
   */
  constructor (version) {
    this.version = version
    this.index = JSON.parse(fs.readFileSync(`./src/bibles/${version}/_index.json`, 'utf8'))
    if (fs.existsSync(`./dist/${version}`)) {
      fs.rmSync(`./dist/${version}`, { recursive: true, force: true })
      fs.mkdirSync(`./dist/${version}`, { recursive: true })
      console.log(`Cleaning \x1b[32mdist/${this.version}\x1b[0m folder`)
    } else {
      fs.mkdirSync(`./dist/${version}`, { recursive: true })
      console.log(`Created \x1b[32mdist/${this.version}\x1b[0m folder`)
    }
  }

  async processBooks () {
    this.index.forEach((book, index) => {
      fs.readFile(`./src/bibles/${this.version}/${book.key}.txt`, 'utf-8', (error, data) => {
        if (error) {
          console.error(error)
          return Promise.reject(error)
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
            `./dist/${this.version}/${book.key}.json`,
            JSON.stringify(json, null, 2),
            'utf-8',
            (error) => {
              if (error) {
                console.log(error)
                return Promise.reject(error)
              }

              // Extra info
              book.number = index + 1
              book.chapters = json.length
              book.verses = json.reduce((count, b) => count + b.length, 0)
            }
        )
      })
    })

    fs.writeFile(
      `./dist/${this.version}/index.json`,
      JSON.stringify(this.index, null, 2),
      'utf-8',
      () => {
        console.log('Bible Generated Successfully!')
      }
    )

    return Promise.resolve(true)
  }

  async exportJS () {
    const exportTemplate = fs.readFileSync('./src/templates/json-server.txt', 'utf8')
    let importSection = this.index.reduce((content, book) => {
      content += `const ${book.key} =  require('./${this.version}/${book.key}.json')\n`
      return content
    }, '')
    importSection += `const index = require('./${this.version}/index.json')\n`

    let exportSection = this.index.reduce((content, book) => {
      content += `${book.key},\n`
      return content
    }, '')
    exportSection += 'index,'

    let template = exportTemplate.replace('/**{BIBLE_IMPORTS}**/', importSection.trim())
    template = template.replace('/**{BIBLE_EXPORTS}**/', exportSection.trim())

    fs.writeFile(
      './dist/index.js',
      template,
      (error) => {
        if (error) {
          console.log(error)
          return Promise.reject(error)
        }

        console.log('Exported Server File Successfully!')
      }
    )
    return Promise.resolve(true)
  }
}
