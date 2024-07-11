import { TxtStrNode } from "@textlint/ast-node-types";
import type { TextlintRuleContext, TextlintRuleModule } from "@textlint/types";

export interface Options {
    normalize_characters?: boolean;
    remove_loose_diacritics?: boolean;
    no_shadda_with_madda?: boolean;
    no_shadda_with_sukun?: boolean;
    no_duplicated_diacritics?: boolean;
    no_middle_tanween?: boolean;
    only_fathatan_on_alef?: boolean;
}

const alefWithFathatan = "\uFD3C\uFD3D";
const fathatan = "\u064B\u08E7\u08F0\uFE70\uFE71";
const dammatan = "\u064C\u08E8\u08F1\uFC5E\uFE72";
const kasratan = "\u064D\u08E9\u08F2\uFC5F\uFE74";

const regex = {
    diacritics: "[\u064B-\u0653]",
    tanween: `[${alefWithFathatan}${fathatan}${dammatan}${kasratan}]`,
    shadda: "[\u0651\u0AFB\uFC5E-\uFC63\uFCF2-\uFCF4\uFE7C\uFE7D\u11237]",
    madda: "\u0653",
    alefMadda: "[\u0622\uFE81\uFE82\uFEF5\uFEF6]",
    sukun: "[\u0652\u07B0\u082C\u08D0\u0AFA\uFE7E\uFE7F\u1123E]",
    alef: "[\u0627\uFE8D\uFE8E\u1EE00]"
};

function normalize(node: TxtStrNode, text: string, context: Readonly<TextlintRuleContext>) {
    const replaces: { [key: string]: { name: string; replace: string } } = {
        ﹱ: { name: "ARABIC TATWEEL WITH FATHATAN ABOVE", replace: "ـً" },
        ﹰ: { name: "ARABIC FATHATAN ISOLATED FORM", replace: "ً" },
        ﹲ: { name: "ARABIC DAMMATAN ISOLATED FORM", replace: "ٌ" },
        ﱞ: {
            name: "ARABIC LIGATURE SHADDA WITH DAMMATAN ISOLATED FORM",
            replace: "ٌّ"
        },
        ﹴ: { name: "ARABIC KASRATAN ISOLATED FORM", replace: "ٍ" },
        ﱟ: {
            name: "ARABIC LIGATURE SHADDA WITH KASRATAN ISOLATED FORM",
            replace: "ٍّ"
        },
        ﹷ: { name: "ARABIC FATHA MEDIAL FORM", replace: "ـَ" },
        ﹶ: { name: "ARABIC FATHA ISOLATED FORM", replace: "َ" },
        ﳲ: {
            name: "ARABIC LIGATURE SHADDA WITH FATHA MEDIAL FORM",
            replace: "ـَّ"
        },
        ﱠ: {
            name: "ARABIC LIGATURE SHADDA WITH FATHA ISOLATED FORM",
            replace: "َّ"
        },
        ﹹ: { name: "ARABIC DAMMA MEDIAL FORM", replace: "ـُ" },
        ﹸ: { name: "ARABIC DAMMA ISOLATED FORM", replace: "ُ" },
        ﳳ: {
            name: "ARABIC LIGATURE SHADDA WITH DAMMA MEDIAL FORM",
            replace: "ـُّ"
        },
        ﱡ: {
            name: "ARABIC LIGATURE SHADDA WITH DAMMA ISOLATED FORM",
            replace: "ُّ"
        },
        ﹻ: { name: "ARABIC KASRA MEDIAL FORM", replace: "ـِ" },
        ﹺ: { name: "ARABIC KASRA ISOLATED FORM", replace: "ِ" },
        ﳴ: {
            name: "ARABIC LIGATURE SHADDA WITH KASRA MEDIAL FORM",
            replace: "ـِّ"
        },
        ﱢ: {
            name: "ARABIC LIGATURE SHADDA WITH KASRA ISOLATED FORM",
            replace: "ِّ"
        },
        ﹽ: { name: "ARABIC SHADDA MEDIAL FORM", replace: "ـّ" },
        ﹼ: { name: "ARABIC SHADDA ISOLATED FORM", replace: "ّ" },
        ﱣ: {
            name: "ARABIC LIGATURE SHADDA WITH SUPERSCRIPT ALEF ISOLATED FORM",
            replace: "ّٰ"
        },
        ﹿ: { name: "ARABIC SUKUN MEDIAL FORM", replace: "ـْ" },
        ﹾ: { name: "ARABIC SUKUN ISOLATED FORM", replace: "ْ" },
        ﴽ: {
            name: "ARABIC LIGATURE ALEF WITH FATHATAN ISOLATED FORM",
            replace: "اً"
        },
        ﴼ: {
            name: "ARABIC LIGATURE ALEF WITH FATHATAN FINAL FORM",
            replace: "اً"
        },
        ﭐ: { name: "ARABIC LETTER ALEF WASLA ISOLATED FORM", replace: "ٱ" },
        ﭑ: { name: "ARABIC LETTER ALEF WASLA FINAL FORM", replace: "ٱ" },
        ﯝ: {
            name: "ARABIC LETTER U WITH HAMZA ABOVE ISOLATED FORM",
            replace: "ٷ"
        },
        ﻷ: {
            name: "ARABIC LIGATURE LAM WITH ALEF WITH HAMZA ABOVE ISOLATED FORM",
            replace: "لأ"
        },
        ﻸ: {
            name: "ARABIC LIGATURE LAM WITH ALEF WITH HAMZA ABOVE FINAL FORM",
            replace: "لأ"
        },
        ﻹ: {
            name: "ARABIC LIGATURE LAM WITH ALEF WITH HAMZA BELOW ISOLATED FORM",
            replace: "لإ"
        },
        ﻺ: {
            name: "ARABIC LIGATURE LAM WITH ALEF WITH HAMZA BELOW FINAL FORM",
            replace: "لإ"
        },
        ﻻ: {
            name: "ARABIC LIGATURE LAM WITH ALEF ISOLATED FORM",
            replace: "لا"
        },
        ﻼ: { name: "ARABIC LIGATURE LAM WITH ALEF FINAL FORM", replace: "لا" },
        ﯪ: {
            name: "ARABIC LIGATURE YEH WITH HAMZA ABOVE WITH ALEF ISOLATED FORM",
            replace: "ئا"
        },
        ﯫ: {
            name: "ARABIC LIGATURE YEH WITH HAMZA ABOVE WITH ALEF FINAL FORM",
            replace: "ئا"
        },
        ﯬ: {
            name: "ARABIC LIGATURE YEH WITH HAMZA ABOVE WITH AE ISOLATED FORM",
            replace: "ئە"
        },
        ﯭ: {
            name: "ARABIC LIGATURE YEH WITH HAMZA ABOVE WITH AE FINAL FORM",
            replace: "ئە"
        },
        ﯮ: {
            name: "ARABIC LIGATURE YEH WITH HAMZA ABOVE WITH WAW ISOLATED FORM",
            replace: "ئو"
        },
        ﯯ: {
            name: "ARABIC LIGATURE YEH WITH HAMZA ABOVE WITH WAW FINAL FORM",
            replace: "ئو"
        },
        ﯰ: {
            name: "ARABIC LIGATURE YEH WITH HAMZA ABOVE WITH U ISOLATED FORM",
            replace: "ئۇ"
        },
        ﯱ: {
            name: "ARABIC LIGATURE YEH WITH HAMZA ABOVE WITH U FINAL FORM",
            replace: "ئۇ"
        },
        ﯲ: {
            name: "ARABIC LIGATURE YEH WITH HAMZA ABOVE WITH OE ISOLATED FORM",
            replace: "ئۆ"
        },
        ﯳ: {
            name: "ARABIC LIGATURE YEH WITH HAMZA ABOVE WITH OE FINAL FORM",
            replace: "ئۆ"
        },
        ﯴ: {
            name: "ARABIC LIGATURE YEH WITH HAMZA ABOVE WITH YU ISOLATED FORM",
            replace: "ئۈ"
        },
        ﯵ: {
            name: "ARABIC LIGATURE YEH WITH HAMZA ABOVE WITH YU FINAL FORM",
            replace: "ئۈ"
        },
        ﯶ: {
            name: "ARABIC LIGATURE YEH WITH HAMZA ABOVE WITH E ISOLATED FORM",
            replace: "ئې"
        },
        ﯷ: {
            name: "ARABIC LIGATURE YEH WITH HAMZA ABOVE WITH E FINAL FORM",
            replace: "ئې"
        },
        ﯸ: {
            name: "ARABIC LIGATURE YEH WITH HAMZA ABOVE WITH E INITIAL FORM",
            replace: "ئې"
        },
        ﯹ: {
            name: "ARABIC LIGATURE UIGHUR KIRGHIZ YEH WITH HAMZA ABOVE WITH ALEF MAKSURA ISOLATED FORM",
            replace: "ئى"
        },
        ﯺ: {
            name: "ARABIC LIGATURE UIGHUR KIRGHIZ YEH WITH HAMZA ABOVE WITH ALEF MAKSURA FINAL FORM",
            replace: "ئى"
        },
        ﯻ: {
            name: "ARABIC LIGATURE UIGHUR KIRGHIZ YEH WITH HAMZA ABOVE WITH ALEF MAKSURA INITIAL FORM",
            replace: "ئى"
        },
        ﰀ: {
            name: "ARABIC LIGATURE YEH WITH HAMZA ABOVE WITH JEEM ISOLATED FORM",
            replace: "ئج"
        },
        ﰁ: {
            name: "ARABIC LIGATURE YEH WITH HAMZA ABOVE WITH HAH ISOLATED FORM",
            replace: "ئح"
        },
        ﰂ: {
            name: "ARABIC LIGATURE YEH WITH HAMZA ABOVE WITH MEEM ISOLATED FORM",
            replace: "ئم"
        },
        ﰃ: {
            name: "ARABIC LIGATURE YEH WITH HAMZA ABOVE WITH ALEF MAKSURA ISOLATED FORM",
            replace: "ئى"
        },
        ﰄ: {
            name: "ARABIC LIGATURE YEH WITH HAMZA ABOVE WITH YEH ISOLATED FORM",
            replace: "ئي"
        },
        ﱤ: {
            name: "ARABIC LIGATURE YEH WITH HAMZA ABOVE WITH REH FINAL FORM",
            replace: "ئر"
        },
        ﱥ: {
            name: "ARABIC LIGATURE YEH WITH HAMZA ABOVE WITH ZAIN FINAL FORM",
            replace: "ئز"
        },
        ﱦ: {
            name: "ARABIC LIGATURE YEH WITH HAMZA ABOVE WITH MEEM FINAL FORM",
            replace: "ئم"
        },
        ﱧ: {
            name: "ARABIC LIGATURE YEH WITH HAMZA ABOVE WITH NOON FINAL FORM",
            replace: "ئن"
        },
        ﱨ: {
            name: "ARABIC LIGATURE YEH WITH HAMZA ABOVE WITH ALEF MAKSURA FINAL FORM",
            replace: "ئى"
        },
        ﱩ: {
            name: "ARABIC LIGATURE YEH WITH HAMZA ABOVE WITH YEH FINAL FORM",
            replace: "ئي"
        },
        ﲗ: {
            name: "ARABIC LIGATURE YEH WITH HAMZA ABOVE WITH JEEM INITIAL FORM",
            replace: "ئج"
        },
        ﲘ: {
            name: "ARABIC LIGATURE YEH WITH HAMZA ABOVE WITH HAH INITIAL FORM",
            replace: "ئح"
        },
        ﲙ: {
            name: "ARABIC LIGATURE YEH WITH HAMZA ABOVE WITH KHAH INITIAL FORM",
            replace: "ئخ"
        },
        ﲚ: {
            name: "ARABIC LIGATURE YEH WITH HAMZA ABOVE WITH MEEM INITIAL FORM",
            replace: "ئم"
        },
        ﲛ: {
            name: "ARABIC LIGATURE YEH WITH HAMZA ABOVE WITH HEH INITIAL FORM",
            replace: "ئه"
        },
        ﳟ: {
            name: "ARABIC LIGATURE YEH WITH HAMZA ABOVE WITH MEEM MEDIAL FORM",
            replace: "ئم"
        },
        ﳠ: {
            name: "ARABIC LIGATURE YEH WITH HAMZA ABOVE WITH HEH MEDIAL FORM",
            replace: "ئه"
        },
        ﺃ: {
            name: "ARABIC LETTER ALEF WITH HAMZA ABOVE ISOLATED FORM",
            replace: "أ"
        },
        ﺄ: {
            name: "ARABIC LETTER ALEF WITH HAMZA ABOVE FINAL FORM",
            replace: "أ"
        },
        ﺅ: {
            name: "ARABIC LETTER WAW WITH HAMZA ABOVE ISOLATED FORM",
            replace: "ؤ"
        },
        ﺆ: {
            name: "ARABIC LETTER WAW WITH HAMZA ABOVE FINAL FORM",
            replace: "ؤ"
        },
        ﺇ: {
            name: "ARABIC LETTER ALEF WITH HAMZA BELOW ISOLATED FORM",
            replace: "إ"
        },
        ﺈ: {
            name: "ARABIC LETTER ALEF WITH HAMZA BELOW FINAL FORM",
            replace: "إ"
        },
        ﺉ: {
            name: "ARABIC LETTER YEH WITH HAMZA ABOVE ISOLATED FORM",
            replace: "ئ"
        },
        ﺊ: {
            name: "ARABIC LETTER YEH WITH HAMZA ABOVE FINAL FORM",
            replace: "ئ"
        },
        ﺋ: {
            name: "ARABIC LETTER YEH WITH HAMZA ABOVE INITIAL FORM",
            replace: "ئ"
        },
        ﺌ: {
            name: "ARABIC LETTER YEH WITH HAMZA ABOVE MEDIAL FORM",
            replace: "ئ"
        },
        ﺀ: { name: "ARABIC LETTER HAMZA ISOLATED FORM", replace: "ء" },
        ﱜ: {
            name: "ARABIC LIGATURE REH WITH SUPERSCRIPT ALEF ISOLATED FORM",
            replace: "رٰ"
        },
        ﱝ: {
            name: "ARABIC LIGATURE ALEF MAKSURA WITH SUPERSCRIPT ALEF ISOLATED FORM",
            replace: "ىٰ"
        },
        ﲐ: {
            name: "ARABIC LIGATURE ALEF MAKSURA WITH SUPERSCRIPT ALEF FINAL FORM",
            replace: "ىٰ"
        },
        ﳙ: {
            name: "ARABIC LIGATURE HEH WITH SUPERSCRIPT ALEF INITIAL FORM",
            replace: "هٰ"
        }
    };
    const { report, fixer, locator, RuleError } = context;

    const replace = (text: string) => {
        for (const [key, value] of Object.entries(replaces)) {
            const regex = new RegExp(key, "g");
            text = text.replace(regex, value.replace);
        }
        return text;
    };

    const matches = text.matchAll(new RegExp(`[${Object.keys(replaces).join("")}]`, "g"));
    for (const match of matches) {
        const index = match.index ?? 0;
        const matchRange = [index, index + match[0].length] as const;
        const ruleError = new RuleError(`Found normalizable character ${replaces[match[0]].name}.`, {
            padding: locator.range(matchRange),
            fix: fixer.replaceText(node, replace(text))
        });
        report(node, ruleError);
    }
}

function noLooseDiacritics(
    node: TxtStrNode,
    text: string,
    context: Readonly<TextlintRuleContext>,
    removeLooseDiacritics: boolean
) {
    const { fixer, report, locator, RuleError } = context;
    const matches = text.matchAll(new RegExp(`\\s${regex.diacritics}`, "g"));
    for (const match of matches) {
        const index = match.index ?? 0;
        const matchRange = [index, index + match[0].length] as const;
        const replace = fixer.replaceTextRange([index + 1, index + match[0].length], "");
        const errObj = removeLooseDiacritics
            ? {
                  padding: locator.range(matchRange),
                  fix: replace
              }
            : {
                  padding: locator.range(matchRange)
              };
        const ruleError = new RuleError("Found loose arabic diacritic.", errObj);
        report(node, ruleError);
    }
}

function noShaddaWithMadda(node: TxtStrNode, text: string, context: Readonly<TextlintRuleContext>) {
    const { report, locator, RuleError } = context;
    const shadda = "[\u0651\u0AFB\uFC5E-\uFC63\uFCF2-\uFCF4\uFE7C\uFE7D\u11237]";
    const alefMadda = "[\u0622\uFE81\uFE82\uFEF5\uFEF6]";
    const madda = "\u0653";

    const matches = text.matchAll(new RegExp(`(${alefMadda}|${madda})${shadda}|${shadda}${madda}`, "g"));
    for (const match of matches) {
        const index = match.index ?? 0;
        const matchRange = [index, index + match[0].length] as const;
        const ruleError = new RuleError("Found Shadda combined with Madda.", {
            padding: locator.range(matchRange)
        });
        report(node, ruleError);
    }
}

function noShaddaWithSukun(node: TxtStrNode, text: string, context: Readonly<TextlintRuleContext>) {
    const { report, locator, RuleError } = context;

    const matches = text.matchAll(new RegExp(`(${regex.shadda})${regex.sukun}|${regex.sukun}${regex.shadda}`, "g"));
    for (const match of matches) {
        const index = match.index ?? 0;
        const matchRange = [index, index + match[0].length] as const;
        const ruleError = new RuleError("Found Shadda combined with Sukun.", {
            padding: locator.range(matchRange)
        });
        report(node, ruleError);
    }
}

function noDuplicatedDiacritics(node: TxtStrNode, text: string, context: Readonly<TextlintRuleContext>) {
    const { report, fixer, locator, RuleError } = context;

    let match;
    let matches = [];
    const doubleRegex = new RegExp(`(${regex.diacritics})${regex.diacritics}*\\1`, "g");

    for (let i = 0; i < text.length; i++) {
        doubleRegex.lastIndex = i; // Start matching from the current position
        match = doubleRegex.exec(text);
        if (match) {
            matches.push(match);
            i = match.index; // Move to the start of the match for the next iteration
        }
    }

    for (const match of matches) {
        const index = match.index ?? 0;
        const matchRange = [index, index + match[0].length] as const;
        const remove = fixer.removeRange([index + match[0].length - 1, index + match[0].length]);
        const ruleError = new RuleError("Found duplicated Arabic diacritic on the same letter.", {
            padding: locator.range(matchRange),
            fix: remove
        });
        report(node, ruleError);
    }
}

function noMiddleTanween(node: TxtStrNode, text: string, context: Readonly<TextlintRuleContext>) {
    const { report, locator, RuleError } = context;

    // FIXME dont't report if the next character is Alef and it's the last letter of the word
    const matches = text.matchAll(new RegExp(`(${regex.tanween})(?=[^\\s]*\\p{Letter})`, "ug"));
    for (const match of matches) {
        const index = match.index ?? 0;
        const matchRange = [index, index + match[0].length] as const;
        const ruleError = new RuleError("Found middle Tanween.", {
            padding: locator.range(matchRange)
        });
        report(node, ruleError);
    }
}

function onlyFathatanOnAlef(node: TxtStrNode, text: string, context: Readonly<TextlintRuleContext>) {
    const { report, locator, RuleError } = context;

    const matches = text.matchAll(new RegExp(`${regex.alef}[${dammatan}${kasratan}]`, "ug"));
    for (const match of matches) {
        const index = match.index ?? 0;
        const matchRange = [index, index + match[0].length] as const;
        const ruleError = new RuleError("Found Tanween on Alef, only Fathatan can be on Alef.", {
            padding: locator.range(matchRange)
        });
        report(node, ruleError);
    }
}

const report: TextlintRuleModule<Options> = (context, options = {}) => {
    const { getSource, Syntax } = context;
    return {
        [Syntax.Str](node) {
            const normalizeCharactersOpt = options.no_duplicated_diacritics ?? true;
            const removeLooseDiacritics = options.remove_loose_diacritics ?? true;
            const shaddaWithMaddaOpt = options.no_shadda_with_madda ?? true;
            const shaddaWithSukunOpt = options.no_shadda_with_sukun ?? true;
            const duplicatedDiacriticsOpt = options.no_duplicated_diacritics ?? true;
            const noMiddleTanweenOpt = options.no_middle_tanween ?? true;
            const onlyFathatanOnAlefOpt = options.only_fathatan_on_alef ?? true;

            const text = getSource(node); // Get text

            noLooseDiacritics(node, text, context, removeLooseDiacritics);

            if (normalizeCharactersOpt) {
                normalize(node, text, context);
            }

            if (shaddaWithMaddaOpt) {
                noShaddaWithMadda(node, text, context);
            }

            if (shaddaWithSukunOpt) {
                noShaddaWithSukun(node, text, context);
            }

            if (duplicatedDiacriticsOpt) {
                noDuplicatedDiacritics(node, text, context);
            }

            if (noMiddleTanweenOpt) {
                noMiddleTanween(node, text, context);
            }

            if (onlyFathatanOnAlefOpt) {
                onlyFathatanOnAlef(node, text, context)
            }
        }
    };
};

export default {
    linter: report,
    fixer: report
};
