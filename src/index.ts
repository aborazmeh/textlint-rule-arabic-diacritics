import { TxtStrNode } from "@textlint/ast-node-types";
import type { TextlintRuleContext, TextlintRuleModule } from "@textlint/types";

export interface Options {
    remove_loose_diacritics?: boolean;
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

const report: TextlintRuleModule<Options> = (context, options = {}) => {
    const { getSource, Syntax } = context;
    return {
        [Syntax.Str](node) {
            const removeLooseDiacritics = options.remove_loose_diacritics ?? true;

            const text = getSource(node); // Get text
            noLooseDiacritics(node, text, context, removeLooseDiacritics);
        }
    };
};

export default {
    linter: report,
    fixer: report
};
