import ObjectGrid from "../domain/ObjectGrid";
import ObjectGridParserConfig, { ObjectGridSymbolConfig } from "./ObjectGridParserConfig";
import ObjectGridColumn from "../domain/ObjectGridColumn";
import ObjectGridCell from "../domain/ObjectGridCell";
import { DittoCell, EvalCell, ConstCell } from "./cells";
import ObjectGridParser from "../domain/ObjectGridParser";
import parseCsv from "csv-parse/lib/sync";
import { transpose } from "../util";


const JsonPattern = /^[0-9"\{\[]/;

export default class ObjectGridCsvParser implements ObjectGridParser {
    constructor(
        private readonly config: ObjectGridParserConfig,
    ) {
    }

    private static metaSymbolMap(config: ObjectGridParserConfig): Map<string, ObjectGridCell> {
        return new Map<string, ObjectGridCell>([
            [config.symbols.ditto, DittoCell.Instance],
        ]);
    }

    public parse(csvText: string | Buffer): ObjectGrid {
        let csv: string[][] = parseCsv(csvText, { ltrim: true, rtrim: true });
        if (this.config.transpose) {
            csv = transpose(csv);
        }

        const headerSize = this.config.header; // TODO: auto size
        const headerCsv = csv.slice(0, headerSize);
        const bodyCsv = csv.slice(headerSize);

        const header  = this.parseHeader(headerCsv);
        const body = this.parseBody(bodyCsv);

        return new ObjectGrid(header, body);
    }

    private parseHeader(headerCsv: string[][]): ObjectGridColumn[] {
        const colLen = headerCsv[0].length;
        const result: ObjectGridColumn[] = [];

        let prevPath: string[] = [];
        for (let c = 0; c < colLen; c++) {
            let curPath: string[] = [];
            let canCopy = true;
            for (let r = 0; r < headerCsv.length; r++) {
                const cur = headerCsv[r][c];
                if (cur === "") {
                    if (canCopy && curPath.length < prevPath.length) {
                        curPath.push(prevPath[r]);
                    }
                } else {
                    curPath.push(cur);
                    canCopy = false;
                }
            }

            result.push(new ObjectGridColumn(curPath));
            prevPath = curPath;
        }

        return result;
    }

    private parseBody(bodyCsv: string[][]): ObjectGridCell[][] {
        const metaMap = ObjectGridCsvParser.metaSymbolMap(this.config);
        const constMap = new Map<string, ObjectGridCell>();
        for (const [k, v] of ObjectGridSymbolConfig.constMap(this.config.symbols).entries()) {
            constMap.set(k, new ConstCell(v)); // TODO: Map.map
        }

        return bodyCsv.map(row =>
            row.map(cellText => this.parseCell(cellText, metaMap, constMap))
        );
    }

    private parseCell(
        cellText: string, metaMap: Map<string, ObjectGridCell>, constMap: Map<string, ObjectGridCell>
    ): any {
        if (cellText === "") {
            return this.config.emptyCell;
        }

        if (metaMap.has(cellText)) {
            return metaMap.get(cellText);
        }

        if (constMap.has(cellText)) {
            return constMap.get(cellText);
        }

        if (JsonPattern.test(cellText)) {
            return new ConstCell(JSON.parse(cellText));
        }

        return new EvalCell(cellText);
    }
}
