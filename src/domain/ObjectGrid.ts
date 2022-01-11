import ObjectGridColumn from "./ObjectGridColumn";
import ObjectGridCell from "./ObjectGridCell";
import ObjectGridCellMeta from "./ObjectGridCellMeta";
import { setProperty } from "../util"


export default class ObjectGrid {
    public constructor(
        public readonly header: ObjectGridColumn[],
        public readonly body: ObjectGridCell[][],
    ) {
    }

    public toObjectNest(inHeader: string, env: object): object {
        const body = this.evalBody(env);

        const inColumns = this.header.map((h, c) => h.path[0] === inHeader ? c : -1).filter(c => 0 <= c);
        const outColumns = this.header.map((h, c) => h.path[0] !== inHeader ? c : -1).filter(c => 0 <= c);

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

    public toObjectArray(env: object): object[] {
        const body = this.evalBody(env);
        
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

    private evalBody(env: object): any[][] {
        // TODO: template
        const templates: any[] = [];

        let prevRow: any[] = [];
        const result: any[][] = [];
        for (let r = 0; r < this.body.length; r++) { // TODO: (r, c) ログ
            const row = this.body[r];
            const curResult: any[] = [];

            for (let c = 0; c < row.length; c++) {
                const meta = new ObjectGridCellMeta(prevRow[c], null);
                curResult.push(row[c].eval(meta, env));
            }

            result.push(curResult);
            prevRow = curResult;
        }

        return result;
    }

}
