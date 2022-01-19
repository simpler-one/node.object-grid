import ObjectGridEvalEnvironment from "./ObjectGridEvalEnvironment";


interface ObjectGridEvalConfig {
    emptyValue?: any;
    escapeChars?: string[]
    environment: ObjectGridEvalEnvironment;
}

namespace ObjectGridEvalConfig {
    export function ofDefault(environment: ObjectGridEvalEnvironment): ObjectGridEvalConfig {
        return {
            emptyValue: undefined,
            escapeChars: ["\r", "\n"],
            environment: environment ?? {},
        };
    }

    export function defaultFilled(config: ObjectGridEvalConfig): ObjectGridEvalConfig {
        // TODO: ObjectUtils.merge
        return {...ofDefault({}), ...config};
    }
}


export default ObjectGridEvalConfig;
