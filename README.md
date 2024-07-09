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

### Loose Diacritics [![textlint rule](https://img.shields.io/badge/textlint-fixable-green.svg)](https://textlint.github.io/)


    أهلا ً وسهلا ً بكم

Only diacritics will be removed and there likely to be an extra space

    أهلا  وسهلا  بكم

### No Duplicated Diacritics on the Same Letter [![textlint rule](https://img.shields.io/badge/textlint-fixable-green.svg)](https://textlint.github.io/)

    يونََُُِِس: قال أبو عبيدة، «يقال:يونس بضم النون وكسرها». والمشهور في القراءة يونُس برفع النون من غير همز.

Duplicated diacritics will be removed

    يونَُِس: قال أبو عبيدة، «يقال:يونس بضم النون وكسرها». والمشهور في القراءة يونُس برفع النون من غير همز.

### No Shadda With Madda

Shadda can't be combined with Madda

    الآّن والآّن والآّن

### No Shadda with Sukun

Shadda can't be combined with Sukun

    ضيّْق

### No Middle Tanween

    لا يمكن للتنوين أن يأتي في وسًٍط وسٍط وسٌط الكلمة

## Usage

Via `.textlintrc.json`(Recommended)

These are default options, you can change them in your .textlintrc file

```json
{
    "rules": {
        "arabic-diacritics": {
          "remove_loose_diacritics": true,
          "no_shadda_with_madda": true,
          "no_shadda_with_sukun": true,
          "no_duplicated_diacritics": true,
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

- Normalize diacritics forms before some regexes like for duplicated diacritics, and Tanween related rules
- No diacritics or Tanween on Alef without Hamza except Tanween Al-Nasb
- No consecutive five Harakat 
- No consecutive three Sokoon
- Twneen on Alef or the letter before
- No Tanween *and* Haraka on the same letter
- No Haraka *and* Sukun on the same letter
- No Sukun on the first letter of the word
- Option for no combining diacritics
- Normalize diacritics: like `U+FE7C` and `U+FE7D` to `U+0651`, and `U+FCF2` to `U+0651` and `U+064E`

## License

MIT © aborazmeh
