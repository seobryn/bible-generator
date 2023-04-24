## Architecture Document

The idea of this document is to agree a standard for the JSON files that builts
the bible entirely, maybe in the future we can extend the generator for other
bible versions and make growth the content to more people and languages 😃.

## Folder Struture

- The main idea of the folder structure is to have folders for each bible
  version inside the `src/bibles` folder, you can find here the `RVR1960` bible
  for now.

- Inside the `RVR1960` folder, you can find now a several files that I'll try to
  describe in the next lines:

1. File `_index.json`: this file contains an array of object which describes
   like asummary of the bible content, the structure follows the next example:

```JSON
[{
  "testament": "", /* A.T. or N.T. */
  "title": "", /* The hole book name. ex. "Libro de Génesis" */
  "shortTitle": "", /* The book short name. ex. "Génesis" */
  "abbr": "", /* Abbrebiature of the book. ex. "Gn" */
  "category": "", /* Category of the book. */
  "key": "" /* The key that you have to use to find the book in the json files */
}]
```

2. `[bookName].txt`: This kind of files contains all the `chapters` and `verses`
   of the book, each chapter is splitted by three asterisks `***` and the verses
   are splitted by line breaks `\n`, so each line is a new verse.

3. Generated `JSON` files: For each book the generator transforms the `.txt`
   file into a `JSON` file following the next structure:

```JSON
[
  {
    "chapter": 1, /* Chapter Number */
    "title": "", /* Special Title for the chapter, not included yet, but yes in the future */
    "verses": [
      {
        "title": "", /* Special Title for the verse if applies, not included yet, but yes in the future */
        "reference": "", /* Reference for the verse if applies, not included yet, but yes in the future  */
        "verse": 1, /* Verse Number */
        "content": "En el principio creó Dios los cielos y la tierra." /* Verse content */
      }
    ]
  }
]
```

This is the basic structure for the transformed files, so the idea is to enhance
this `JSON` file to be able to add titles for each chapter for instance, or
something like that.
