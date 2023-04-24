# Reina Valera 1960 Bible generator

The idea of this project is to share a RVR 1960 Version of bible in `JSON`
format to use where you need.

In some places, the bibles are exposed within HTML tags and other things inside
the text that make it hard to use in different places, so the idea here is to
expose the bible content in the most cleaner way and available for everyone.

## Reina Valera 1960 bible

- This bible are organized in `json` format, by chapters and verses. each `json`
  file represents a book inside the bible and follow the next structure:

```JSON
[{
  "chapter": 1,
  "verses": [
    {
      "verse": 1,
      "content": "The Verse content"
    }
  ]
}]
```

## How to use a Generator?

1. download the repository code.
2. run `yarn` command to install dependencies.
3. run `yarn start [bibleVersion] [--exportJS](optional)` command to build the
   Bible.
4. If you select the option `--exportJS` you can have also a `JS` file to use in
   conjuntion with `json-server` to make any test that you need exposing your
   bible as an API locally.

## Code Standards

We follow the `Standard JS` code standards, so you can review the standards to
follow.

## Are you want to contribute?

Feel free to make a `fork` and starting a `PR`, contributing with anything that
you like!.

## Roadmap

- [] include introduction for each book (WIP).
- [] includes titles for each chapter.
- [] include references for verses that applies.
