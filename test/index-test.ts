import TextLintTester from "textlint-tester";
import rule from "../src/index";

const tester = new TextLintTester();
// ruleName, rule, { valid, invalid }
tester.run("rule", rule, {
    valid: [
        "أهلاً وسهلاً",
        "الآن",
        "ضيّق",
        "يونَُِس: قال أبو عبيدة، «يقال:يونس بضم النون وكسرها». والمشهور في القراءة يونُس برفع النون من غير همز.",
        {
            text: "ضيّْق",
            options: {
                no_shadda_with_sukun: false
            }
        }
    ],
    invalid: [
        {
            text: "أهلا ً وسهلا ً بكم.",
            output: "أهلا ً وسهلا ً بكم.",
            options: {
                remove_loose_diacritics: false
            },
            errors: [
                {
                    message: "Found loose arabic diacritic.",
                    range: [4, 6]
                },
                {
                    message: "Found loose arabic diacritic.",
                    range: [12, 14]
                }
            ]
        },
        {
            text: "أهلا ً وسهلا ً بكم.",
            output: "أهلا  وسهلا  بكم.",
            options: {
                remove_loose_diacritics: true
            },
            errors: [
                {
                    message: "Found loose arabic diacritic.",
                    range: [4, 6]
                },
                {
                    message: "Found loose arabic diacritic.",
                    range: [12, 14]
                }
            ]
        },
        {
            text: "الآّن والآّن والآّن",
            options: {
                no_shadda_with_madda: true
            },
            errors: [
                {
                    message: "Found Shadda combined with Madda.",
                    range: [2, 4]
                },
                {
                    message: "Found Shadda combined with Madda.",
                    range: [10, 12]
                },
                {
                    message: "Found Shadda combined with Madda.",
                    range: [18, 20]
                }
            ]
        },
        {
            text: "ضيّْق",
            options: {
                no_shadda_with_sukun: true
            },
            errors: [
                {
                    message: "Found Shadda combined with Sukun.",
                    range: [2, 4]
                }
            ]
        },
        {
            text: "يونََُُِِس: قال أبو عبيدة، «يقال:يونس بضم النون وكسرها». والمشهور في القراءة يونُس برفع النون من غير همز.",
            output: "يونَُِس: قال أبو عبيدة، «يقال:يونس بضم النون وكسرها». والمشهور في القراءة يونُس برفع النون من غير همز.",
            errors: [
                {
                    message: "Found duplicated Arabic diacritic on the same letter.",
                    range: [3, 7]
                },
                { message: "Found duplicated Arabic diacritic on the same letter.", range: [4, 8] },
                { message: "Found duplicated Arabic diacritic on the same letter.", range: [5, 9] }
            ]
        },
        {
            text: "تجربة لشدَّّتين على نفس الحرف",
            output: "تجربة لشدَّتين على نفس الحرف",
            errors: [
                {
                    message: "Found duplicated Arabic diacritic on the same letter.",
                    range: [9, 12]
                }
            ]
        }
    ]
});
