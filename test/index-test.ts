import TextLintTester from "textlint-tester";
import rule from "../src/index";

const tester = new TextLintTester();
// ruleName, rule, { valid, invalid }
tester.run("rule", rule, {
    valid: ["أهلاً وسهلاً", "الآن"],
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
        }
    ]
});
