import TextLintTester from "textlint-tester";
import rule from "../src/index";

const tester = new TextLintTester();
// ruleName, rule, { valid, invalid }
tester.run("rule", rule, {
    valid: [
        "الآن",
        "ضيّق",
        "يونَُِس: قال أبو عبيدة، «يقال:يونس بضم النون وكسرها». والمشهور في القراءة يونُس برفع النون من غير همز.",
        {
            text: "أهلاً وسهلاً",
            options: {
                fathatan_before_alef: false
            }
        },
        {
            text: "من علامات الاسم: التنوين آخر الاسم المنصرف؛ السماء صافيةٌ، رأيت عامراً، مررت بدكانٍ",
            options: {
                fathatan_before_alef: false
            }
        },
        {
            text: "ضيّْق",
            options: {
                no_shadda_with_sukun: false
            }
        },
        {
            text: "تجريبﴼ تجريباً",
            options: {
                normalize: false,
                fathatan_before_alef: false
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
            text: "اجتماع الشدة والسكون على حرّْفٍ واحدٍ غير ممكن",
            errors: [
                {
                    message: "Found Shadda combined with Sukun.",
                    range: [27, 29]
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
        },
        {
            text: "لا يمكن للتنوين أن يأتي في وسًٍط وسٍط وسٌط الكلمة",
            errors: [
                {
                    message: "Found middle Tanween.",
                    range: [29, 30]
                },
                {
                    message: "Found middle Tanween.",
                    range: [30, 31]
                },
                {
                    message: "Found middle Tanween.",
                    range: [35, 36]
                },
                {
                    message: "Found middle Tanween.",
                    range: [40, 41]
                }
            ]
        },
        {
            text: "تجريبﴼ",
            output: "تجريباً",
            options: {
                fathatan_before_alef: false
            },
            errors: [
                {
                    message: "Found normalizable character ARABIC LIGATURE ALEF WITH FATHATAN FINAL FORM.",
                    range: [5, 6]
                }
            ]
        },
        {
            text: "تجريباٌ تجريباٍ",
            errors: [
                {
                    message: "Found Tanween on Alef, only Fathatan can be on Alef.",
                    range: [5, 7]
                },
                {
                    message: "Found Tanween on Alef, only Fathatan can be on Alef.",
                    range: [13, 15]
                }
            ]
        },
        {
            text: "تجريباً تجريبﴼ",
            output: "تجريبًا تجريبًا",
            options: {
                normalize: false,
                fathatan_before_alef: true
            },
            errors: [
                {
                    range: [4, 7],
                    message: "Found Fathatan on Alef."
                },
                {
                    range: [12, 14],
                    message: "Found Fathatan on Alef."
                }
            ]
        }
    ]
});
