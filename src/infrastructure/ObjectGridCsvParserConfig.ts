interface ObjectGridCsvParserConfig {
    header?: number;
    ignoredHeaders?: string[];
    symbols?: ObjectGridSymbolConfig;
    asString?: boolean;
    transpose?: boolean;
}
namespace ObjectGridCsvParserConfig {
    export function ofDefault(): ObjectGridCsvParserConfig {
        return {
            header: 2,
            ignoredHeaders: ["#"],
            symbols: ObjectGridSymbolConfig.ofDefault(),
            asString: false,
            transpose: false,
        };
    }

    export function defaultFilled(config: ObjectGridCsvParserConfig): ObjectGridCsvParserConfig {
        // TODO: ObjectUtils.merge
        return {...ofDefault(), ...config};
    }
}
export default ObjectGridCsvParserConfig;


export interface ObjectGridSymbolConfig {
    ditto: string;
    template: string;

    undefined: string[];
    null: string[];
    true: string[];
    false: string[];

    caseSensitive: boolean;
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

            caseSensitive: false,
        };
    }

    export function defaultFilled(config: ObjectGridSymbolConfig): ObjectGridSymbolConfig {
        return {...ofDefault(), ...config};
    }

    export function constMap(config: ObjectGridSymbolConfig): Map<string, any> {
        const result = new Map<string, any>();

        config.undefined.forEach(sbl => result.set(lower(sbl, !config.caseSensitive), undefined));
        config.null.forEach(sbl => result.set(lower(sbl, !config.caseSensitive), null));
        config.true.forEach(sbl => result.set(lower(sbl, !config.caseSensitive), true));
        config.false.forEach(sbl => result.set(lower(sbl, !config.caseSensitive), false));

        return result;
    }
}


function lower(symbol: string, enabled: boolean) {
    return enabled ? symbol.toLowerCase() : symbol;
}
