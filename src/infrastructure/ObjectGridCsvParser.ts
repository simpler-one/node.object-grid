import ObjectGrid from "../domain/ObjectGrid";
import ObjectGridCsvParserConfig, { ObjectGridSymbolConfig } from "./ObjectGridCsvParserConfig";
import ObjectGridColumn from "../domain/ObjectGridColumn";
import ObjectGridCell from "../domain/ObjectGridCell";
import { DittoCell, EvalCell, ConstCell, EmptyCell } from "./cells";
import ObjectGridParser from "../domain/ObjectGridParser";
import parseCsv from "csv-parse/lib/sync";
import { transpose } from "../util";


const JsonPattern = /^[0-9"\{\[]/;

export default class ObjectGridCsvParser implements ObjectGridParser {
    constructor(
        private readonly config: ObjectGridCsvParserConfig,
    ) {
        this.config = ObjectGridCsvParserConfig.defaultFilled(config);
    }

    private static metaSymbolMap(config: ObjectGridCsvParserConfig): Map<string, ObjectGridCell> {
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
        const ignoredColumns = new Set(this.config.ignoredHeaders);

        let prevPath: string[] = [];
        for (let c = 0; c < colLen; c++) {
            let curPath: string[] = [];
            let canCopy = true;
            for (let r = 0; r < headerCsv.length; r++) {
                const cur = headerCsv[r][c];
                if (ignoredColumns.has(cur)) {
                    break;
                }

                if (cur === "") {
                    if (!canCopy || prevPath.length <= r) {
                        continue; // Ignore
                    }

                    curPath.push(prevPath[r]);
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
            return EmptyCell.Instance;
        }

        if (metaMap.has(cellText)) {
            return metaMap.get(cellText);
        }

        const symbolText = this.config.symbols.caseSensitive ? cellText : cellText.toLowerCase();
        if (constMap.has(symbolText)) {
            return constMap.get(symbolText);
        }

        if (JsonPattern.test(cellText)) {
            return new ConstCell(JSON.parse(cellText));
        }

        return new EvalCell(cellText);
    }
}
