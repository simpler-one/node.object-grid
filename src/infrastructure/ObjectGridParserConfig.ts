interface ObjectGridParserConfig {
    header?: number;
    symbols?: ObjectGridSymbolConfig;
    emptyCell?: any;
    transpose?: boolean;
}
namespace ObjectGridParserConfig {
    export function ofDefault(): ObjectGridParserConfig {
        return {
            header: 2,
            symbols: ObjectGridSymbolConfig.ofDefault(),
            emptyCell: undefined,
            transpose: false,
        };
    }

    export function fillDefault(config: ObjectGridParserConfig): ObjectGridParserConfig {
        return {...ofDefault(), ...config};
    }
}
export default ObjectGridParserConfig;


export interface ObjectGridSymbolConfig {
    ditto: string;
    template: string;

    undefined: string[];
    null: string[];
    true: string[];
    false: string[];

    caseSensitiveUndefined: boolean;
    caseSensitiveNull: boolean;
    caseSensitiveTrue: boolean;
    caseSensitiveFalse: boolean;
}
export namespace ObjectGridSymbolConfig {
    export function ofDefault(): ObjectGridSymbolConfig {
        return {
            ditto: "..",
            template: "$$",

            undefined: ["undefined"],
            null: ["null"],
            true: ["true"],
            false: ["false"],

            caseSensitiveUndefined: false,
            caseSensitiveNull: false,
            caseSensitiveTrue: false,
            caseSensitiveFalse: false,
        };
    }

    export function fillDefault(config: ObjectGridSymbolConfig): ObjectGridSymbolConfig {
        return {...ofDefault(), ...config};
    }

    export function constMap(config: ObjectGridSymbolConfig): Map<string, any> {
        const result = new Map<string, any>();

        config.undefined.forEach(sbl => result.set(lower(sbl, !config.caseSensitiveUndefined), undefined));
        config.null.forEach(sbl => result.set(lower(sbl, !config.caseSensitiveNull), null));
        config.true.forEach(sbl => result.set(lower(sbl, !config.caseSensitiveTrue), true));
        config.false.forEach(sbl => result.set(lower(sbl, !config.caseSensitiveFalse), false));

        return result;
    }
}


function lower(symbol: string, enabled: boolean) {
    return enabled ? symbol.toLowerCase() : symbol;
}
