# textlint-rule-arabic-diacritics [![Actions Status: test](https://github.com/aborazmeh/textlint-rule-arabic-diacritics/workflows/test/badge.svg)](https://github.com/aborazmeh/textlint-rule-arabic-diacritics/actions?query=workflow%3A"test") [![textlint rule](https://img.shields.io/badge/textlint-fixable-green.svg?style=social)](https://textlint.github.io/)

rules for Arabic diacritics issues

## Install

Install with [npm](https://www.npmjs.com/):

    npm install textlint-rule-arabic-diacritics

## Fixable

[![textlint rule](https://img.shields.io/badge/textlint-fixable-green.svg?style=social)](https://textlint.github.io/) 

```
textlint --rule no-kasheeda --fix README.md
```

## Examples

### Loose Diacritics

    أهلا ً وسهلا ً بكم

Only diacritics will be removed and there likely to be an extra space

    أهلا  وسهلا  بكم

## Usage

Via `.textlintrc.json`(Recommended)

```json
{
    "rules": {
        "arabic-diacritics": {
          "remove_loose_diacritics": true
        }
    }
}
```

Via CLI

```
textlint --rule arabic-diacritics README.md
```

### Build

Builds source codes for publish to the `lib` folder.
You can write ES2015+ source codes in `src/` folder.

    npm run build

### Tests

Run test code in `test` folder.
Test textlint rule by [textlint-tester](https://github.com/textlint/textlint-tester).

    npm test

## TODO

- No diacritics or Tanween on Alef without Hamza except Tanween Al-Nasb
- No middle Tanween
- No consecutive five Harakat 
- No consecutive three Sokoon
- Twneen on Alef or the letter before
- No Madda with Shadda
- No Tanween *and* Haraka on the same letter
- No Haraka *and* Sukun on the same letter
- No Sukun on the first letter of the word

## License

MIT © aborazmeh
