import ObjectGridColumn from "./ObjectGridColumn";
import ObjectGridCell from "./ObjectGridCell";
import ObjectGridCellMeta from "./ObjectGridCellMeta";
import { setProperty } from "../util"
import ObjectGridEvalConfig from "./ObjectGridEvalConfig";

// TODO: StringUtil
const ESCAPE_MAP = {
    "\t": "\\t",
    "\n": "\\n",
    "\r": "\\r",
};


export default class ObjectGrid {
    public constructor(
        public readonly header: ObjectGridColumn[],
        public readonly body: ObjectGridCell[][],
    ) {
    }

    public toObjectNest(
        inHeader: string,
        evalConfig: ObjectGridEvalConfig,
        opt: {
            outHeaders?: string[],
            separateByOutHeader?: boolean,
            skipEmptyRow: boolean,
        } = undefined
    ): object {
        evalConfig = ObjectGridEvalConfig.defaultFilled(evalConfig);

        const body = this.evalBody(evalConfig);
        const asOut = opt?.outHeaders ? Set.prototype.has.bind(new Set(opt?.outHeaders)) : () => true;

        const inColumns = this.header.flatMap((h, c) => h.path[0] === inHeader ? c : []);
        const outColumns = this.header.flatMap((h, c) => h.path[0] !== inHeader && asOut(h.path[0]) ? c : []);

        const result = {};
        for (let r = 0; r < body.length; r++) { // TODO: (r, c) ログ
            const row = body[r];
            const inPath = inColumns.map(colI => String(row[colI]));

            const curResult = {};
            for (const c of outColumns) {
                this.header[c].setTo(curResult, row[c]);
            }

            setProperty(result, inPath, curResult);
        }

        return result;
    }

    public toObjectArray(evalConfig: ObjectGridEvalConfig): object[] {
        const body = this.evalBody(evalConfig);
        
        const result: object[] = [];
        for (let r = 0; r < body.length; r++) { // TODO: (r, c) ログ
            const row = body[r];
            const curResult = {};
            for (let c = 0; c < row.length; c++) {
                this.header[c].setTo(curResult, row[c]);
            }

            result.push(curResult);
        }

        return result;
    }

    private evalBody(config: ObjectGridEvalConfig): any[][] {
        // TODO: template
        const templates: any[] = [];

        let prevRow: any[] = [];
        const result: any[][] = [];
        for (let r = 0; r < this.body.length; r++) { // TODO: (r, c) ログ
            const row = this.body[r];
            const curResult: any[] = [];

            for (let c = 0; c < row.length; c++) {
                const meta = new ObjectGridCellMeta(prevRow[c], null);
                const result = ObjectGrid.escapeChar(row[c].eval(config, meta), config);
                curResult.push(result);
            }

            result.push(curResult);
            prevRow = curResult;
        }

        return result;
    }

    private static escapeChar(value: any, config: ObjectGridEvalConfig): any {
        if (typeof value !== "string") {
            return value;
        }

        let result = value;
        for (const char of config.escapeChars) {
            result = result.replaceAll(char, ESCAPE_MAP[char]);
        }

        return result;
    }
}
