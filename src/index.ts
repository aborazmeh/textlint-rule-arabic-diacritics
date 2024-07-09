import { TxtStrNode } from "@textlint/ast-node-types";
import type { TextlintRuleContext, TextlintRuleModule } from "@textlint/types";

export interface Options {
    remove_loose_diacritics?: boolean;
    no_shadda_with_madda?: boolean;
}

function noLooseDiacritics(
    node: TxtStrNode,
    text: string,
    context: Readonly<TextlintRuleContext>,
    removeLooseDiacritics: boolean
) {
    const { fixer, report, locator, RuleError } = context;
    const matches = text.matchAll(/\s[\u064B-\u0653]/g);
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

const report: TextlintRuleModule<Options> = (context, options = {}) => {
    const { getSource, Syntax } = context;
    return {
        [Syntax.Str](node) {
            const removeLooseDiacritics = options.remove_loose_diacritics ?? true;
            const shaddaWithMaddaOpt = options.no_shadda_with_madda ?? true;

            const text = getSource(node); // Get text
            noLooseDiacritics(node, text, context, removeLooseDiacritics);

            if (shaddaWithMaddaOpt) {
                noShaddaWithMadda(node, text, context);
            }
        }
    };
};

export default {
    linter: report,
    fixer: report
};
