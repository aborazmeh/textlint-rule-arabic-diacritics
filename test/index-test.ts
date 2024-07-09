import TextLintTester from "textlint-tester";
import rule from "../src/index";

const tester = new TextLintTester();
// ruleName, rule, { valid, invalid }
tester.run("rule", rule, {
    valid: ["أهلاً وسهلاً"],
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
        }
    ]
});
