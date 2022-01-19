import ObjectGridCell from "../../domain/ObjectGridCell"
import ObjectGridCellMeta from "../../domain/ObjectGridCellMeta";
import ObjectGridEvalConfig from "../../domain/ObjectGridEvalConfig";


export default class DittoCell implements ObjectGridCell {
    public get isEmpty(): boolean {
        return false;
    }

    public static Instance = new DittoCell();

    public eval(config: ObjectGridEvalConfig, meta: ObjectGridCellMeta): any {
        return meta.prev;
    }
}
