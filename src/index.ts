import type { TextlintRuleModule } from "@textlint/types";

export interface Options {
    remove_loose_diacritics?: boolean;
}

const report: TextlintRuleModule<Options> = (context, options = {}) => {
    const { Syntax, RuleError, fixer, report, getSource, locator } = context;
    return {
        [Syntax.Str](node) {
            const removeLooseDiacritics = options.remove_loose_diacritics ?? true;
            const text = getSource(node); // Get text
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
    };
};

export default {
    linter: report,
    fixer: report
};
